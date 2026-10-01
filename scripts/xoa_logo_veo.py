#!/usr/bin/env python3
"""Xoa logo Veo khoi toan bo kho clip public/clips_*/.

Ghi ra thu muc MOI public/clips_<slug>_clean/ - KHONG dung den ban goc.
Chay lai duoc: file nao co ban sach hop le roi thi bo qua.

Toa do do bang mat + MIN qua 150 frame (xem memory reference_xoa_watermark_veo):
  1080x1920: dau lap lanh + chu "Veo"
  720x1280 : chi co chu "Veo" (da soi 6 clip khac nhau, khong co lap lanh)
delogo doi vung nam HAN trong khung (x+w < rong, y+h < cao).

Dung:
    python scripts/xoa_logo_veo.py            # chay that
    python scripts/xoa_logo_veo.py --thu 5    # lam thu 5 clip roi dung
"""

import argparse
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# (x, y, w, h) theo tung kich thuoc khung. Chi co chu "Veo", KHONG co gi khac.
#
# 09/10 do lai lan 3 (2 lan truoc deu sai, hop rong qua -> vet nhoe):
#   - Lan 1: keo hop (845,1685,215,125) tu hlglive sang. Clip LAN khong co
#     dau lap lanh o do -> delogo cha len nen sach, vet nhoe to hon ca logo.
#   - Lan 2: hop van rong gap 6 lan chu that -> con nhoe ngang ben trai.
#   - Lan 3 (dung): chong 1 frame cua 40 CLIP KHAC NHAU lay MIN
#     (scripts/do_logo_nhieu_clip.py). Chong nhieu frame trong CUNG 1 clip
#     KHONG dung: canh it chuyen dong thi nen khong tut, ra day diem vo dung.
#     Do duoc khung 720: chu Veo o x 683..703, y 1256..1264 (chi 21x9 px).
#     Khung 1080 = x1.5 -> x 1024..1055, khop voi so do tren ban render.
HOP = {
    (1080, 1920): [(1014, 1873, 54, 34)],
    (720, 1280): [(676, 1249, 36, 23)],
}

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def khung_cua(v: Path) -> tuple[int, int] | None:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", str(v)],
        capture_output=True, text=True)
    try:
        w, h = r.stdout.strip().split("x")
        return int(w), int(h)
    except Exception:
        return None


def xong_roi(dest: Path, goc: Path) -> bool:
    """Ban sach da co va doc duoc (khong phai file cut giua duong)."""
    if not dest.exists() or dest.stat().st_size < goc.stat().st_size // 4:
        return False
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(dest)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip()) > 0.2
    except Exception:
        return False


def lam(v: Path) -> tuple[str, str]:
    dest_dir = v.parent.with_name(v.parent.name + "_clean")
    dest = dest_dir / v.name

    if xong_roi(dest, v):
        return "bo_qua", v.name

    k = khung_cua(v)
    if k is None:
        return "loi_doc", f"{v.parent.name}/{v.name}"
    if k not in HOP:
        return "khung_la", f"{v.parent.name}/{v.name} {k[0]}x{k[1]}"

    vf = ",".join(f"delogo=x={x}:y={y}:w={w}:h={h}" for x, y, w, h in HOP[k])
    dest_dir.mkdir(parents=True, exist_ok=True)
    tam = dest.with_suffix(".tam.mp4")

    r = subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(v),
         "-vf", vf, "-c:v", "libx264", "-crf", "18", "-preset", "veryfast",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-c:a", "copy", str(tam)],
        capture_output=True, text=True)

    if r.returncode != 0 or not tam.exists():
        tam.unlink(missing_ok=True)
        return "loi_ffmpeg", f"{v.parent.name}/{v.name}: {r.stderr.strip()[:120]}"

    tam.replace(dest)
    return "xong", f"{v.parent.name}/{v.name}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--thu", type=int, default=0, help="chi lam N clip dau")
    ap.add_argument("--luong", type=int, default=3, help="so ffmpeg chay cung luc")
    args = ap.parse_args()

    vids = sorted(v for v in PUBLIC.glob("clips_*/*.mp4")
                  if not v.parent.name.endswith("_clean"))
    if args.thu:
        vids = vids[: args.thu]
    print(f"{len(vids)} clip | {args.luong} luong")

    dem: dict[str, int] = {}
    with ThreadPoolExecutor(max_workers=args.luong) as ex:
        for i, (tt, ten) in enumerate(ex.map(lam, vids), 1):
            dem[tt] = dem.get(tt, 0) + 1
            if tt not in ("xong", "bo_qua"):
                print(f"  [{i}/{len(vids)}] !! {tt}: {ten}")
            elif i % 50 == 0 or i == len(vids):
                print(f"  [{i}/{len(vids)}] " +
                      " ".join(f"{k}={n}" for k, n in sorted(dem.items())))

    print("-" * 70)
    for k, n in sorted(dem.items()):
        print(f"  {k:<12} {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
