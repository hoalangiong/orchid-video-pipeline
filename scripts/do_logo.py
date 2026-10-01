#!/usr/bin/env python3
"""Do CHINH XAC o chu "Veo" bang cach chong N frame lay MIN.

Nen doi tung frame, logo dung yen -> MIN qua nhieu frame thi nen tut xuong
toi, chi con logo sang. Sau do lay diem sang hon (trung vi + do lech) roi
bao bounding box.

Dung:
    python scripts/do_logo.py public/clips_agrifos/outro.mp4
    python scripts/do_logo.py <clip1> <clip2> ...
"""

import statistics
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SO_FRAME = 60

# vung soi rong (x, y, w, h) theo khung
VUNG = {
    (1080, 1920): (940, 1800, 138, 118),
    (720, 1280): (620, 1200, 98, 78),
}

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def khung(v: Path) -> tuple[int, int]:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", str(v)],
        capture_output=True, text=True)
    w, h = r.stdout.strip().split("x")
    return int(w), int(h)


def do(v: Path) -> None:
    k = khung(v)
    if k not in VUNG:
        print(f"{v.name}: khung la {k}")
        return
    cx, cy, cw, ch = VUNG[k]

    with tempfile.TemporaryDirectory() as td:
        t = Path(td)
        subprocess.run(
            ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(v),
             "-vf", f"crop={cw}:{ch}:{cx}:{cy},format=gray",
             "-frames:v", str(SO_FRAME), str(t / "f%03d.png")],
            capture_output=True, text=True)
        fs = sorted(t.glob("*.png"))
        if not fs:
            print(f"{v.name}: khong lay duoc frame")
            return
        mn = Image.open(fs[0]).convert("L")
        for f in fs[1:]:
            mn = ImageChops.darker(mn, Image.open(f).convert("L"))

    px = list(mn.getdata())
    tv = statistics.median(px)
    do_lech = statistics.pstdev(px) or 1
    nguong = tv + max(12, do_lech)
    diem = [(i % cw, i // cw) for i, p in enumerate(px) if p > nguong]
    if not diem:
        print(f"{v.name}: KHONG thay logo (nguong {nguong:.0f}, tv {tv:.0f})")
        return
    xs = [d[0] for d in diem]
    ys = [d[1] for d in diem]
    print(f"{v.name} {k[0]}x{k[1]} | {len(diem)} diem | tv={tv:.0f} nguong={nguong:.0f}")
    print(f"   frame: x {cx + min(xs)}..{cx + max(xs)}  y {cy + min(ys)}..{cy + max(ys)}")

    out = ROOT / "_wm_check" / f"min_{v.parent.name}_{v.stem}.png"
    out.parent.mkdir(exist_ok=True)
    mn.resize((cw * 4, ch * 4), Image.NEAREST).save(out)


def _min2(a: Image.Image, b: Image.Image) -> Image.Image:
    from PIL import ImageChops
    return ImageChops.darker(a, b)


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        do(Path(arg))
