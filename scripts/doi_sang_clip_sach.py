#!/usr/bin/env python3
"""Doi kho clip sang ban da xoa logo, KHONG sua mot dong code nao.

Cach lam: doi TEN THU MUC, khong sua staticFile trong 120 file .tsx.
  clips_<slug>        -> clips_<slug>_goc     (giu lam ban luu)
  clips_<slug>_clean  -> clips_<slug>         (thanh ban code doc vao)

Vi sao doi ten thay vi sua code: co 103 cho ghi cung "clips_xxx/" va 3 cho
dung bien `clips_${cfg.slug}`. Sua 103 cho ma bo sot 3 cho kia thi video ra
lan logo, rat kho phat hien. Doi ten thi ca 106 cho tu dung dung.

An toan:
  - Kiem DU FILE truoc khi doi: thieu 1 mp4 la dung han, khong doi gi ca.
  - 8 file .jpg trong clips_* (_img_*, _ref_*) khong co code nao doc (da grep),
    nhung van copy sang cho du.
  - Lui lai duoc: python scripts/doi_sang_clip_sach.py --lui

Dung:
    python scripts/doi_sang_clip_sach.py --xem     # chi xem, khong doi
    python scripts/doi_sang_clip_sach.py           # doi that
    python scripts/doi_sang_clip_sach.py --lui     # tra ve nhu cu
"""

import argparse
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def kiem() -> tuple[list[Path], list[str]]:
    """Tra ve (danh sach thu muc doi duoc, danh sach loi)."""
    duoc, loi = [], []
    for p in sorted(PUBLIC.glob("clips_*")):
        if not p.is_dir() or p.name.endswith(("_clean", "_goc")):
            continue
        c = p.with_name(p.name + "_clean")
        if not c.is_dir():
            loi.append(f"{p.name}: chua co ban sach")
            continue
        g = {v.name for v in p.glob("*.mp4")}
        s = {v.name for v in c.glob("*.mp4")}
        if g - s:
            loi.append(f"{p.name}: ban sach thieu {sorted(g - s)}")
            continue
        if p.with_name(p.name + "_goc").exists():
            loi.append(f"{p.name}: da co _goc roi (doi lan truoc chua xong?)")
            continue
        duoc.append(p)
    return duoc, loi


def doi(xem_thoi: bool) -> int:
    duoc, loi = kiem()
    print(f"Doi duoc: {len(duoc)} thu muc | Van de: {len(loi)}")
    for x in loi[:10]:
        print(f"  !! {x}")
    if loi:
        print("\nCo van de -> KHONG doi gi ca. Sua xong roi chay lai.")
        return 1
    if xem_thoi:
        print("\n(--xem: khong doi gi). Bo --xem de doi that.")
        return 0

    xong = 0
    for p in duoc:
        goc = p.with_name(p.name + "_goc")
        clean = p.with_name(p.name + "_clean")

        # copy file .jpg ghi chu sang ban sach cho du
        for j in p.glob("*.jpg"):
            if not (clean / j.name).exists():
                shutil.copy2(j, clean / j.name)

        p.rename(goc)          # clips_x     -> clips_x_goc
        clean.rename(p)        # clips_x_clean -> clips_x
        xong += 1
        if xong % 40 == 0:
            print(f"  {xong}/{len(duoc)}")

    print(f"\nXong {xong} thu muc.")
    print("Ban goc con nguyen o clips_*_goc/ (lui lai bang --lui).")
    print("Gio render lai la ra video khong logo.")
    return 0


def lui() -> int:
    """Tra ve nhu cu: clips_x -> clips_x_clean, clips_x_goc -> clips_x."""
    cap = [p for p in sorted(PUBLIC.glob("clips_*_goc")) if p.is_dir()]
    if not cap:
        print("Khong co clips_*_goc nao -> chua doi lan nao.")
        return 1
    print(f"Lui {len(cap)} thu muc")
    for g in cap:
        ten = g.name[:-4]                  # bo "_goc"
        hien = g.with_name(ten)            # clips_x (dang la ban sach)
        if hien.exists():
            hien.rename(g.with_name(ten + "_clean"))
        g.rename(g.with_name(ten))
    print("Da tra ve nhu cu.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--xem", action="store_true", help="chi kiem tra, khong doi")
    ap.add_argument("--lui", action="store_true", help="tra ve nhu cu")
    a = ap.parse_args()
    return lui() if a.lui else doi(a.xem)


if __name__ == "__main__":
    sys.exit(main())
