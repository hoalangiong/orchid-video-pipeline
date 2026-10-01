#!/usr/bin/env python3
"""Quet 266 video trong out/ xem video nao con logo Veo. CHI DOC, khong sua gi.

Chu "Veo" la lop ban trong suot: tren canh TOI thi no SANG hon nen. Nen do
theo do noi so voi nen cuc bo, khong theo nguong tuyet doi (nguong tuyet doi
bao dong nham voi canh nang - da tung sai kieu nay).

Do tren ban render 1080x1920: logo o x=1025..1055, y=1883..1894.

Dung:
    python scripts/quet_logo_out.py
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"

# vung soi, nam han trong khung 1080x1920
CX, CY, CW, CH = 1000, 1870, 80, 40
MOC = [3, 12, 25]        # giay lay frame
NOI = 20                 # sang hon nen bao nhieu thi tinh la chu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def co_logo(v: Path) -> tuple[bool, str]:
    """True neu thay chu Veo o vung goc phai duoi."""
    thay = 0
    xem = 0
    for t in MOC:
        with tempfile.TemporaryDirectory() as td:
            f = Path(td) / "a.png"
            r = subprocess.run(
                ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                 "-ss", str(t), "-i", str(v), "-vframes", "1",
                 "-vf", f"crop={CW}:{CH}:{CX}:{CY},format=gray", str(f)],
                capture_output=True, text=True)
            if r.returncode != 0 or not f.exists():
                continue
            xem += 1
            im = Image.open(f)
            px = im.load()
            w, h = im.size
            vals = [px[x, y] for y in range(h) for x in range(w)]
            tb = sum(vals) / len(vals)
            diem = sum(1 for y in range(h) for x in range(w) if px[x, y] > tb + NOI)
            # chu "Veo" nho: khoang 30-150 diem. Nhieu hon la canh that.
            if 20 <= diem <= 400:
                thay += 1
    if xem == 0:
        return False, "khong lay duoc frame"
    return thay > 0, f"{thay}/{xem} frame thay"


def main() -> int:
    vids = sorted(OUT.glob("*.mp4"))
    print(f"Quet {len(vids)} video trong out/")
    print("-" * 70)

    co, khong, loi = [], [], []
    for i, v in enumerate(vids, 1):
        ok, ghi = co_logo(v)
        if "khong lay duoc" in ghi:
            loi.append(v.name)
        elif ok:
            co.append(v.name)
        else:
            khong.append(v.name)
        if i % 25 == 0:
            print(f"  [{i}/{len(vids)}] co={len(co)} khong={len(khong)} loi={len(loi)}")

    print("-" * 70)
    print(f"CON logo : {len(co)}")
    print(f"SACH     : {len(khong)}")
    print(f"loi doc  : {len(loi)}")

    (ROOT / "_wm_check").mkdir(exist_ok=True)
    ds = ROOT / "_wm_check" / "out_con_logo.txt"
    ds.write_text("\n".join(co), encoding="utf-8")
    print(f"\nDanh sach video con logo: {ds.relative_to(ROOT)}")
    print("Phai soi mat thuong vai video trong danh sach truoc khi xoa.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
