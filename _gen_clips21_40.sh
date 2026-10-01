#!/bin/bash
# Batch xu ly 20 video LanHay21-40 tu clip thuc trong kho tu lieu.
# Moi topic: 1 clip nguon -> 3 ban crop/zoom khac nhau (title/tip/outro)
# Ap dung transform ne ban quyen (mirror + crop + color nudge + strip metadata)
set -e

FFMPEG="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg"
SRC_ROOT="/c/Users/Dell Precision 5560/.openclaw/tulieu-video"
OUT_ROOT="/c/Users/Dell Precision 5560/.openclaw/remotion-video/public"

# slug|source_relative_path|start_offset_sec (tranh doan dau/cuoi bi rung/mo)
declare -A TOPICS=(
  [lanhay21_caesarred]="tulieu/mathoa/facebook/20260907_61584236093280_1048077778036079.mp4|1"
  [lanhay22_cattleya]="tulieu/mathoa/tiktok/20260824_7637111533071844359_7677615935255088392.mp4|1"
  [lanhay23_sonthuytien]="tulieu/mathoa/facebook/20260903_100072276041179_1712526096470570.mp4|1"
  [lanhay24_hoangthao]="tulieu/mathoa/tiktok/20260825_7125333619854345217_7678052245111311623.mp4|2"
  [lanhay25_vunutethien]="tulieu/mathoa/tiktok/20260806_7653650484347241488_7670736269571345684.mp4|1"
  [lanhay26_duoicaovuongian]="tulieu/vuongian/tiktok/20260902_7637111533071844359_7680916910178929938.mp4|2"
  [lanhay27_giahacdo]="tulieu/mathoa/tiktok/20260802_7653650484347241488_7669270879817305365.mp4|2"
  [lanhay28_hoangnhan]="tulieu/mathoa/facebook/m.facebook.com_2634629710313588.mp4|1"
  [lanhay29_gianghuong]="tulieu/mathoa/facebook/m.facebook.com_1037628975484428.mp4|1"
  [lanhay30_kimdiep]="tulieu/mathoa/tiktok/20260710_6945015330671297538_7660835663197097237.mp4|1"
  [lanhay31_duoicaotim]="tulieu/mathoa/facebook/20260828_100063756810449_1061408129843516.mp4|1"
  [lanhay32_socta]="tulieu/mathoa/tiktok/20260829_7076113800738751489_7679312579969305876.mp4|2"
  [lanhay33_soclao]="tulieu/mathoa/facebook/20260721_61570091891061_1042619988466993.mp4|1"
  [lanhay34_vayrong]="tulieu/mathoa/facebook/20260730_61570091891061_1510446420907686.mp4|1"
  [lanhay35_nuhoanglilip]="tulieu/mathoa/tiktok/20260829_6776069175972692994_7679263810154188052.mp4|2"
  [lanhay36_bocap]="tulieu/mathoa/tiktok/20260809_6945015330671297538_7671844413143846165.mp4|1"
  [lanhay37_diachlan]="tulieu/mathoa/tiktok/20260830_6796263981054723073_7679679924566871314.mp4|1"
  [lanhay38_hoanghauxanh]="tulieu/mathoa/facebook/20260807_61570091891061_1580333206883855.mp4|1"
  [lanhay39_phidiepvang]="tulieu/mathoa/tiktok/20260903_7500589154780251154_7681326270499556626.mp4|2"
  [lanhay40_kimthoa]="tulieu/mathoa/tiktok/20260710_6945015330671297538_7660724821948386580.mp4|1"
)

# Loc chung: strip metadata, transcode h264, scale/pad ve 1080x1920
COMMON="-map_metadata -1 -metadata comment= -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -an -r 30 -movflags +faststart -y"

process_scene() {
  local src="$1" out="$2" start="$3" dur="$4" filter="$5"
  "$FFMPEG" -v error -ss "$start" -t "$dur" -i "$src" -vf "$filter" $COMMON "$out"
}

for slug in "${!TOPICS[@]}"; do
  IFS='|' read -r relpath offset <<< "${TOPICS[$slug]}"
  src="$SRC_ROOT/$relpath"
  destdir="$OUT_ROOT/clips_$slug"
  mkdir -p "$destdir"

  if [ ! -f "$src" ]; then
    echo "MISSING SOURCE: $slug -> $relpath"
    continue
  fi

  # title: toan canh, it crop, hoi mirror de ne ban quyen, mau ho hoi am
  title_out="$destdir/title.mp4"
  if [ ! -f "$title_out" ]; then
    echo "=== $slug / title ==="
    process_scene "$src" "$title_out" "$offset" 6 \
      "hflip,crop=iw*0.94:ih*0.94:iw*0.03:ih*0.03,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.05:saturation=1.08:brightness=0.01"
  else
    echo "  skip $slug/title (exists)"
  fi

  # tip: zoom cận vào giữa khung (crop nhỏ hơn quanh tâm), khong mirror
  tip_out="$destdir/tip.mp4"
  if [ ! -f "$tip_out" ]; then
    echo "=== $slug / tip ==="
    process_scene "$src" "$tip_out" "$offset" 6 \
      "crop=iw*0.72:ih*0.72:iw*0.14:ih*0.14,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.08:saturation=1.12:brightness=0.02"
  else
    echo "  skip $slug/tip (exists)"
  fi

  # outro: mirror + crop lech goc khac, mau am hon chut
  outro_out="$destdir/outro.mp4"
  if [ ! -f "$outro_out" ]; then
    echo "=== $slug / outro ==="
    process_scene "$src" "$outro_out" "$offset" 6 \
      "hflip,crop=iw*0.86:ih*0.86:iw*0.08:ih*0.1,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.03:saturation=1.05:brightness=-0.01"
  else
    echo "  skip $slug/outro (exists)"
  fi
done

echo "=== ALL CLIPS DONE (21-40) ==="
