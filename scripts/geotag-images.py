#!/usr/bin/env python3
"""
GPS-Geotagging Script for Rex Bedachungs GmbH
==============================================
Embeds GPS coordinates (51.46262, 7.24442) into all JPEG/JPG images
in the attached_assets/ directory as EXIF metadata.

Usage:
    python3 scripts/geotag-images.py

Notes:
- Only .jpg and .jpeg files are processed (EXIF is natively supported)
- .png and .webp files are skipped (limited EXIF support)
- Existing EXIF data (camera info etc.) is preserved; only GPS data is added/overwritten
- Run again at any time when new images are added to attached_assets/
"""

import os
import sys
import struct
import piexif

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------
LATITUDE  = 51.46262   # Rex Bedachungs GmbH, Bochum
LONGITUDE =  7.24442

SEARCH_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "attached_assets")

EXCLUDE_DIRS = {".cache", "node_modules", ".git", ".local"}

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

def decimal_to_dms_rational(decimal_degrees):
    """Convert decimal degrees to DMS (degrees, minutes, seconds) as piexif rational tuples."""
    d = abs(decimal_degrees)
    degrees = int(d)
    minutes = int((d - degrees) * 60)
    seconds = round(((d - degrees) * 60 - minutes) * 60 * 1000000)
    return (
        (degrees, 1),
        (minutes, 1),
        (seconds, 1000000),
    )


def build_gps_ifd(lat, lon):
    """Build the GPS IFD dict for piexif."""
    lat_ref = b"N" if lat >= 0 else b"S"
    lon_ref = b"E" if lon >= 0 else b"W"

    gps_ifd = {
        piexif.GPSIFD.GPSVersionID:       (2, 3, 0, 0),
        piexif.GPSIFD.GPSLatitudeRef:     lat_ref,
        piexif.GPSIFD.GPSLatitude:        decimal_to_dms_rational(lat),
        piexif.GPSIFD.GPSLongitudeRef:    lon_ref,
        piexif.GPSIFD.GPSLongitude:       decimal_to_dms_rational(lon),
    }
    return gps_ifd


def embed_gps(filepath, lat, lon):
    """
    Embed GPS coordinates into a JPEG file.
    Preserves existing EXIF data and only adds/overwrites GPS IFD.
    Returns True on success, False on failure.
    """
    try:
        exif_dict = piexif.load(filepath)
    except piexif.InvalidImageDataError:
        print(f"  [WARNUNG] Kein gueltiges JPEG oder EXIF-Fehler: {filepath}")
        return False
    except Exception as e:
        print(f"  [WARNUNG] Konnte EXIF nicht lesen: {filepath} ({e})")
        exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}

    exif_dict["GPS"] = build_gps_ifd(lat, lon)

    try:
        exif_bytes = piexif.dump(exif_dict)
        piexif.insert(exif_bytes, filepath)
        return True
    except Exception as e:
        print(f"  [FEHLER] Konnte GPS nicht einbetten: {filepath} ({e})")
        return False


def find_images(root):
    """Recursively find image files under root, skipping excluded dirs."""
    jpg_files  = []
    skipped    = []

    for dirpath, dirnames, filenames in os.walk(root):
        # Prune excluded directories in-place
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for fname in sorted(filenames):
            lower = fname.lower()
            fpath = os.path.join(dirpath, fname)
            if lower.endswith(".jpg") or lower.endswith(".jpeg"):
                jpg_files.append(fpath)
            elif lower.endswith(".png") or lower.endswith(".webp"):
                skipped.append((fpath, lower.rsplit(".", 1)[-1].upper()))

    return jpg_files, skipped


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("GPS-Geotagging — Rex Bedachungs GmbH")
    print(f"Koordinaten: {LATITUDE}°N, {LONGITUDE}°E")
    print(f"Verzeichnis: {SEARCH_ROOT}")
    print("=" * 60)

    if not os.path.isdir(SEARCH_ROOT):
        print(f"[FEHLER] Verzeichnis nicht gefunden: {SEARCH_ROOT}")
        sys.exit(1)

    jpg_files, skipped_files = find_images(SEARCH_ROOT)

    # --- Report inventory ---
    print(f"\nGefundene JPEG-Dateien: {len(jpg_files)}")
    for f in jpg_files:
        print(f"  {os.path.relpath(f)}")

    print(f"\nUebersprungene Dateien (PNG/WEBP — eingeschraenkte EXIF-Unterstuetzung): {len(skipped_files)}")
    for f, fmt in skipped_files:
        print(f"  [WARNUNG] {fmt} wird uebersprungen: {os.path.relpath(f)}")

    # --- Embed GPS ---
    print("\nStarte Geotagging ...")
    tagged   = 0
    failed   = 0

    for fpath in jpg_files:
        rel = os.path.relpath(fpath)
        success = embed_gps(fpath, LATITUDE, LONGITUDE)
        if success:
            tagged += 1
            print(f"  [OK] {rel}")
        else:
            failed += 1

    # --- Summary ---
    print("\n" + "=" * 60)
    print("ZUSAMMENFASSUNG")
    print("=" * 60)
    print(f"  Erfolgreich getaggt : {tagged}")
    print(f"  Fehlgeschlagen      : {failed}")
    print(f"  Uebersprungen       : {len(skipped_files)}")
    print(f"  Gesamt verarbeitet  : {tagged + failed + len(skipped_files)}")
    print("=" * 60)

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
