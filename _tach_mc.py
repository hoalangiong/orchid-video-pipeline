# -*- coding: utf-8 -*-
"""
Tach nen clip MC Vy -> WebM alpha (VP9) cho Remotion.

Di TRUC TIEP tu clip goc (c1_talking.mp4, quay that trong vuon lan) sang alpha,
KHONG qua buoc "nen xanh" trung gian nua.

Vi sao bo buoc nen xanh:
  Ban *_green.mp4 hoi 11/9 tach nen khong tới: la lan, cai gio treo, manh hang rao
  canh dau, mo xo dua tren ban con dinh lai va dinh luon vao mau xanh. Sau do
  chromakey lay cai mau xanh ra thi mo rac do bien thanh bong mo nua trong suot
  trong video. Loi o buoc tach nen, khong phai o clip goc.
  Di thang anh -> alpha thi khong co mau xanh de dinh, cung khong co vien xanh
  phai despill.

Chay:
  py _tach_mc.py thu                 # tach 1 frame ra PNG + anh chong nen magenta de coi
  py _tach_mc.py chay <vao> <ra>     # tach ca clip -> webm alpha

Bay da biet:
  - ffmpeg KHONG doc duoc alpha cua VP9 (ffprobe bao yuv420p, decode ra den).
    Muon kiem tra do trong suot thi phai render that bang Remotion roi coi frame.
    Rieng PNG thi ffmpeg doc alpha binh thuong -> nen buoc "thu" dung PNG.
  - libvpx-vp9 PHAI co -auto-alt-ref 0, thieu la no bo alpha di.
"""
import os, sys, subprocess, shutil

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

FFMPEG = r"C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
HOST = r"C:\Users\Dell Precision 5560\.openclaw\hlglive\_ref\host_clips"
OUT = r"C:\Users\Dell Precision 5560\.openclaw\remotion-video\out\_matte"

# u2net_human_seg: 1-2 giay/frame, ~6 phut ca clip 213 frame.
# Da thu birefnet-portrait: cat sach hon that, nhung 11-15 giay/frame = 55 phut moi
# clip, VA chay 4 tien trinh song song cung khong nhanh hon (do 15s/frame, te hon
# chay mot minh) vi onnxruntime tren may nay chi co CPU, khong nap duoc CUDA.
# Cho nen: dung model nhanh, roi bu chat luong bang _giu_khoi_lon + cat khung sat hon.
MODEL = os.environ.get("MC_MODEL", "u2net_human_seg")

# Cat khung MC truoc khi tach nen: lay BAN THAN TREN (dau + vai + mot ban tay),
# cat ngang o nguc, ngay TREN cai binh tuoi.
#
# Vi sao cat cao nhu vay chu khong lay ca nguoi:
#   Cai chau lan o goc duoi phai DINH vao nguoi qua mot cai la cham binh tuoi, nen
#   no nam trong cung mot khoi lien thong -> _giu_khoi_lon khong bo duoc. La chau do
#   lai xen ke voi vay va voi voi binh tuoi, khong co hinh chu nhat nao tach duoc
#   hai thu ra. Cat ngang tren binh tuoi thi mat luon binh tuoi, NHUNG bo sach chau,
#   la, ban, mo xo dua - khong con manh rac nao.
#   (Da thu 500:1020:180:580 va 440:1120:340:540: khung dau cat mat ban tay, khung
#    sau du tay nhung keo ca chau lan vao.)
#
# Toa do cua khung: x 340..780, y 540..1320 tren khung goc 1080x1920.
#   - Ngang 340..780: om vua nguoi, chua 20px du hai ben. Khung cu bat dau o x=180
#     tuc lech 160px sang trai (toan nen), nen MC bi day lech va bi cat tay ben phai.
#   - Doc bat dau 540: cach dinh dau ~50px. Ket 1320: ngay tren vanh binh tuoi.
# Duong cat ngang nay roi DUNG day khung video (bottom:0) nen khong thay vet cat.
# c1_talking va c1_idle quay cung mot may, cung khuon hinh -> dung chung khung cat.
CROP = os.environ.get("MC_CROP", "440:780:340:540")


def _session():
    from rembg import new_session
    try:
        return new_session(MODEL), MODEL
    except Exception as e:
        print("Khong nap duoc %s (%s), lui ve u2net" % (MODEL, e), flush=True)
        return new_session("u2net"), "u2net"


# alpha_matting va cai bam vien rang cua cua u2net, nhung no chay closed-form matting
# tren CPU: do that la 16-19 GIAY/frame, 213 frame la hon 1 tieng moi clip.
# birefnet-portrait vốn ra vien mem san nen khong can buoc nay -> tat di cho nhanh.
# Muon bat lai: MC_MATTING=1
MATTING = os.environ.get("MC_MATTING", "") == "1"


# Giu lai DUY NHAT khoi lien thong lon nhat trong mat na.
# Vi sao can: u2net_human_seg nhanh gap 10 lan birefnet (1-2s so voi 11-15s moi frame)
# nhung no chua lai cai chau lan mo o goc duoi phai. Cai chau do la mot khoi RIENG,
# khong dinh vao nguoi -> bo het tru khoi lon nhat la nguoi (tay dang cam binh tuoi
# nen binh tuoi cung nam trong cung mot khoi). Ton vai milli giay, khong dang ke.
# Tat di: MC_LON_NHAT=0
LON_NHAT = os.environ.get("MC_LON_NHAT", "1") == "1"


def _giu_khoi_lon(im):
    import numpy as np
    from scipy import ndimage
    from PIL import Image
    a = np.array(im)
    # Nguong 16 chu khong phai 0: vien mem co alpha rat thap, lay ca vien mo thi mo
    # rac roi rac co the noi hai khoi lai voi nhau thanh mot.
    nhan, so = ndimage.label(a[:, :, 3] > 16)
    if so <= 1:
        return im
    dem = np.bincount(nhan.ravel())
    dem[0] = 0
    a[:, :, 3] = np.where(nhan == dem.argmax(), a[:, :, 3], 0)
    return Image.fromarray(a, "RGBA")


def _cut(im, sess):
    from rembg import remove
    if MATTING:
        ra = remove(im, session=sess, alpha_matting=True,
                    alpha_matting_foreground_threshold=240,
                    alpha_matting_background_threshold=15,
                    alpha_matting_erode_size=8)
    else:
        ra = remove(im, session=sess)
    return _giu_khoi_lon(ra) if LON_NHAT else ra


def thu(vao=None, frame="00:00:03"):
    """Tach 1 frame roi chong len nen magenta -> coi ngay duoc cho nao con sot nen."""
    from PIL import Image
    vao = vao or os.path.join(HOST, "c1_talking.mp4")
    os.makedirs(OUT, exist_ok=True)
    goc = os.path.join(OUT, "thu_goc.png")

    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-ss", frame, "-i", vao,
                    "-vf", "crop=%s" % CROP, "-frames:v", "1", goc], check=True)

    sess, ten = _session()
    cut = _cut(Image.open(goc).convert("RGBA"), sess)
    trong = os.path.join(OUT, "thu_alpha.png")
    cut.save(trong)

    # Nen magenta: mau nay khong co trong ao/da/la nen sot nen la thay lien.
    mag = Image.new("RGBA", cut.size, (255, 0, 255, 255))
    mag.alpha_composite(cut)
    kiem = os.path.join(OUT, "thu_kiem.jpg")
    mag.convert("RGB").save(kiem, quality=92)

    print("Model: %s" % ten, flush=True)
    print("Ra   : %s" % kiem, flush=True)
    return kiem


# Chia 3 buoc rieng thay vi mot ham chay lien, de con chay NHIEU tien trinh tach
# song song tren cung thu muc frame. birefnet-portrait tren CPU mat ~18s/frame, 213
# frame la hon 1 tieng moi clip; may co 16 nhan nen chia 4 phan chay cung luc.
# onnxruntime mac dinh gianh het nhan cho 1 anh, phai dat OMP_NUM_THREADS cho tung
# tien trinh keo khong chung tranh nhan roi cham hon chay 1 minh.

def xe(vao, tmp, fps=30):
    """Buoc 1: mp4 -> PNG tung frame (da cat khung)."""
    if os.path.isdir(tmp):
        shutil.rmtree(tmp)
    os.makedirs(tmp, exist_ok=True)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", vao,
                    "-vf", "crop=%s,fps=%d" % (CROP, fps),
                    os.path.join(tmp, "f%05d.png")], check=True)
    n = len([f for f in os.listdir(tmp) if f.endswith(".png")])
    print("Xe %d frame -> %s" % (n, tmp), flush=True)
    return n


def tach(tmp, i0, i1):
    """Buoc 2: tach nen frame thu i0..i1 (dem tu 1, ke ca i1). Ghi de len chinh no."""
    from PIL import Image
    ds = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))[int(i0) - 1:int(i1)]
    sess, ten = _session()
    for i, f in enumerate(ds, 1):
        p = os.path.join(tmp, f)
        _cut(Image.open(p).convert("RGBA"), sess).save(p)
        if i % 10 == 0 or i == len(ds):
            print("  [%s-%s] %d/%d" % (i0, i1, i, len(ds)), flush=True)


def dong(tmp, ra, fps=30):
    """Buoc 3: PNG co alpha -> webm VP9 alpha."""
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-framerate", str(fps),
                    "-i", os.path.join(tmp, "f%05d.png"),
                    "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
                    "-auto-alt-ref", "0", "-b:v", "4500k",
                    "-deadline", "good", "-cpu-used", "4", "-an", ra], check=True)
    print("Ra: %s (%.1f MB)" % (ra, os.path.getsize(ra) / 1048576), flush=True)
    return ra


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Dung: py _tach_mc.py thu | xe <vao> <tmp> | "
                         "tach <tmp> <i0> <i1> | dong <tmp> <ra>")
    lenh = sys.argv[1]
    if lenh == "thu":
        thu(*sys.argv[2:])
    elif lenh == "xe":
        xe(sys.argv[2], sys.argv[3])
    elif lenh == "tach":
        tach(sys.argv[2], sys.argv[3], sys.argv[4])
    elif lenh == "dong":
        dong(sys.argv[2], sys.argv[3])
    else:
        raise SystemExit("Lenh la: %s" % lenh)
