#!/usr/bin/env python3
"""Do o chu "Veo" bang cach chong 1 frame cua NHIEU clip khac nhau lay MIN.

Vi sao khong chong nhieu frame trong 1 clip: canh it chuyen dong thi nen
khong tut xuong, ket qua ra day diem (da thu, 2/3 clip vo dung).
Chong nhieu CLIP thi nen khac han nhau -> nen ve toi, chi logo dung yen.

Dung:
    python scripts/do_logo_nhieu_clip.py
"""

import statistics
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SO_CLIP = 40

# vung soi rong quanh goc phai duoi (x, y, w, h)
VUNG = {
    (1080, 1920): (930, 1790, 148, 128),
    (720, 1280): (620, 1195, 98, 83),
}

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def khung(v: Path) -> tuple[int, int] | None:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", str(v)],
        capture_output=True, text=True)
    try:
        w, h = r.stdout.strip().split("x")
        return int(w), int(h)
    except Exception:
        return None


def mot_frame(v: Path, vung: tuple[int, int, int, int], ra: Path) -> bool:
    cx, cy, cw, ch = vung
    r = subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(v),
         "-vf", f"crop={cw}:{ch}:{cx}:{cy},format=gray",
         "-frames:v", "1", "-update", "1", str(ra)],
        capture_output=True, text=True)
    return r.returncode == 0 and ra.exists()


def do(k: tuple[int, int], clips: list[Path]) -> None:
    vung = VUNG[k]
    cx, cy, cw, ch = vung
    mn = None
    dem = 0
    with tempfile.TemporaryDirectory() as td:
        for i, v in enumerate(clips[:SO_CLIP]):
            f = Path(td) / f"{i}.png"
            if not mot_frame(v, vung, f):
                continue
            im = Image.open(f).convert("L")
            mn = im if mn is None else ImageChops.darker(mn, im)
            dem += 1
    if mn is None:
        print(f"{k}: khong lay duoc frame nao")
        return

    px = list(mn.getdata())
    tv = statistics.median(px)
    nguong = tv + 25
    diem = [(i % cw, i // cw) for i, p in enumerate(px) if p > nguong]
    print(f"\n=== {k[0]}x{k[1]} | chong {dem} clip | trung vi={tv:.0f} nguong={nguong:.0f}")
    if not diem:
        print("   KHONG thay diem sang nao")
    else:
        xs = [d[0] for d in diem]
        ys = [d[1] for d in diem]
        x1, x2 = cx + min(xs), cx + max(xs)
        y1, y2 = cy + min(ys), cy + max(ys)
        print(f"   {len(diem)} diem | frame: x {x1}..{x2}  y {y1}..{y2}")
        print(f"   -> hop delogo: ({x1 - 4}, {y1 - 4}, {x2 - x1 + 9}, {y2 - y1 + 9})")

    out = ROOT / "_wm_check" / f"minclip_{k[0]}.png"
    out.parent.mkdir(exist_ok=True)
    mn.resize((cw * 5, ch * 5), Image.NEAREST).save(out)
    print(f"   anh: {out.relative_to(ROOT)}")


def main() -> int:
    vids = sorted(v for v in PUBLIC.glob("clips_*/*.mp4")
                  if not v.parent.name.endswith(("_clean", "_goc")))
    theo: dict[tuple[int, int], list[Path]] = {}
    # rai deu: lay 1 clip moi thu muc truoc cho nen khac nhau
    for v in vids:
        k = khung(v)
        if k in VUNG:
            theo.setdefault(k, []).append(v)
        if all(len(theo.get(x, [])) >= SO_CLIP for x in VUNG):
            break
    for k in VUNG:
        if theo.get(k):
            do(k, theo[k])
    return 0


if __name__ == "__main__":
    sys.exit(main())
