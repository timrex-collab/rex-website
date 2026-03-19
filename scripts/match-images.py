#!/usr/bin/env python3
"""
Automatischer Bildvergleich: WebP-Bilder gegen JPEG-Kandidaten.
Methode: RGB-Histogramm-Vergleich (normalisierte Korrelation).
Liest nur — keine Dateien werden verändert, kopiert oder gelöscht.
"""

import os
import sys
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_rgb(path: str) -> Image.Image:
    full = os.path.join(ROOT, path)
    img = Image.open(full).convert("RGB")
    return img


def histogram_similarity(img_a: Image.Image, img_b: Image.Image) -> float:
    """
    Compute similarity as the mean per-channel histogram correlation.
    Returns a value in [0, 1] where 1 = identical histograms.
    """
    scores = []
    for channel in range(3):
        ha = np.array(img_a.split()[channel].histogram(), dtype=np.float32)
        hb = np.array(img_b.split()[channel].histogram(), dtype=np.float32)
        ha /= ha.sum() + 1e-12
        hb /= hb.sum() + 1e-12
        # Bhattacharyya coefficient (= Hellinger dot product)
        bc = float(np.sum(np.sqrt(ha * hb)))
        scores.append(bc)
    return float(np.mean(scores))


def rating(score: float) -> str:
    if score > 0.90:
        return "Sicher"
    elif score >= 0.75:
        return "Wahrscheinlich"
    else:
        return "Unklar"


COMPARISONS = [
    {
        "label": "gruendach-bochum-dachbegruenung-experten",
        "webp": "client/public/images/gruendach-bochum-dachbegruenung-experten.webp",
        "candidates": [
            "attached_assets/Gründach1.jpg",
            "attached_assets/Gründach2.jpg",
            "attached_assets/Gruendach3.jpg",
        ],
    },
    {
        "label": "gruendach-extensive-begruenung-bochum",
        "webp": "client/public/images/gruendach-extensive-begruenung-bochum.webp",
        "candidates": [
            "attached_assets/Gründach1.jpg",
            "attached_assets/Gründach2.jpg",
            "attached_assets/Gruendach3.jpg",
        ],
    },
    {
        "label": "gruendach-intensive-begruenung-bochum",
        "webp": "client/public/images/gruendach-intensive-begruenung-bochum.webp",
        "candidates": [
            "attached_assets/Gründach1.jpg",
            "attached_assets/Gründach2.jpg",
            "attached_assets/Gruendach3.jpg",
        ],
    },
    {
        "label": "dachdecker-bochum-steildach-hero",
        "webp": "client/public/images/dachdecker-bochum-steildach-hero.webp",
        "candidates": [
            "attached_assets/stock_images/professional_roofer__9ee8341f.jpg",
            "attached_assets/S7300254.jpg",
        ],
    },
    {
        "label": "velux-dachfenster-einbau-bochum-fachbetrieb",
        "webp": "client/public/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp",
        "candidates": [
            "attached_assets/Datei 20.10.25, 19 56 47.jpeg",
        ],
    },
    {
        "label": "flachdach-metallverkleidung-bochum-rex-bedachung",
        "webp": "client/public/images/flachdach-metallverkleidung-bochum-rex-bedachung.webp",
        "candidates": [
            "attached_assets/Entwaesserung1.jpg",
        ],
    },
]


results = []

print("=" * 72)
print("  Bildvergleich: WebP ↔ JPEG-Kandidaten (Histogramm-Korrelation)")
print("=" * 72)

for comp in COMPARISONS:
    webp_path = os.path.join(ROOT, comp["webp"])
    print(f"\nWebP: {comp['label']}.webp")

    if not os.path.exists(webp_path):
        print(f"  [FEHLER] WebP nicht gefunden: {comp['webp']}")
        results.append({"label": comp["label"], "best": "N/A", "score": 0.0, "rating": "Fehler"})
        continue

    try:
        webp_img = load_rgb(comp["webp"])
    except Exception as e:
        print(f"  [FEHLER] WebP konnte nicht geladen werden: {e}")
        results.append({"label": comp["label"], "best": "N/A", "score": 0.0, "rating": "Fehler"})
        continue

    best_candidate = None
    best_score = -1.0
    best_candidate_size = None

    for cand_rel in comp["candidates"]:
        cand_path = os.path.join(ROOT, cand_rel)
        if not os.path.exists(cand_path):
            print(f"  [FEHLER] Kandidat nicht gefunden: {cand_rel}")
            continue
        try:
            cand_img = load_rgb(cand_rel)
            score = histogram_similarity(webp_img, cand_img)
            cand_name = os.path.basename(cand_rel)
            mark = "  <<< BESTER MATCH" if score > best_score else ""
            print(f"  [{score:.4f}] {cand_name}  ({cand_img.width}×{cand_img.height}){mark if score <= best_score else ''}")
            if score > best_score:
                best_score = score
                best_candidate = cand_rel
                best_candidate_size = f"{cand_img.width}×{cand_img.height}"
        except Exception as e:
            print(f"  [FEHLER] {os.path.basename(cand_rel)}: {e}")

    # Print all again with mark
    print()
    print(f"  WebP-Auflösung     : {webp_img.width}×{webp_img.height}")
    if best_candidate:
        bc_name = os.path.basename(best_candidate)
        r = rating(best_score)
        print(f"  Bester Match       : {bc_name}")
        print(f"  JPEG-Auflösung     : {best_candidate_size}")
        print(f"  Ähnlichkeitswert   : {best_score:.4f}")
        print(f"  Bewertung          : {r}")
        results.append({
            "label": comp["label"],
            "best": bc_name,
            "score": best_score,
            "rating": r,
        })
    else:
        print("  Kein Kandidat gefunden.")
        results.append({"label": comp["label"], "best": "N/A", "score": 0.0, "rating": "Fehler"})

print("\n")
print("=" * 72)
print("  ZUSAMMENFASSUNGSTABELLE")
print("=" * 72)
print(f"{'WebP-Datei':<50} {'Bester Match':<35} {'Score':>6}  {'Bewertung'}")
print("-" * 105)
for r in results:
    print(f"{r['label'][:50]:<50} {r['best']:<35} {r['score']:>6.4f}  {r['rating']}")
print("=" * 72)
