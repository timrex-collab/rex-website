#!/usr/bin/env python3
"""
Convert specific PNG source files to JPEG (quality 85, RGB mode forced).
PNG originals are NOT deleted.
"""

import os
from PIL import Image

MAPPINGS = [
    ("attached_assets/Tondach1.png",                                       "attached_assets/Tondach1.jpg"),
    ("attached_assets/Tondach2.png",                                       "attached_assets/Tondach2.jpg"),
    ("attached_assets/tondach_hero.png",                                   "attached_assets/tondach_hero.jpg"),
    ("attached_assets/Reparatur1.png",                                     "attached_assets/Reparatur1.jpg"),
    ("attached_assets/Velux1_1761088286795.png",                           "attached_assets/Velux1.jpg"),
    ("attached_assets/Dachdecker bei der Inspektion der Naht_1761081506440.png",
                                                                           "attached_assets/Dachdecker_Inspektion.jpg"),
]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

converted = []
errors = []

for src_rel, dst_rel in MAPPINGS:
    src = os.path.join(ROOT, src_rel)
    dst = os.path.join(ROOT, dst_rel)

    if not os.path.exists(src):
        errors.append(f"MISSING: {src_rel}")
        continue

    try:
        img = Image.open(src)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")
        elif img.mode != "RGB":
            img = img.convert("RGB")
        img.save(dst, "JPEG", quality=85, optimize=True)
        converted.append(f"OK: {src_rel} -> {dst_rel}")
        print(f"Converted: {src_rel} -> {dst_rel}")
    except Exception as e:
        errors.append(f"ERROR: {src_rel}: {e}")
        print(f"Error converting {src_rel}: {e}")

print(f"\nConverted {len(converted)}/{len(MAPPINGS)} files.")
if errors:
    print("Issues:")
    for e in errors:
        print(f"  {e}")
