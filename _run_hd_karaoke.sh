#!/bin/bash
# Render 3 tap HaiLa (217/218/219) voi caption KARAOKE. TUAN TU (chung _fixedbundle -> khong song song).
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
FF="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffprobe.exe"

render() {
  comp="$1"; s="$2"
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== $comp ($s) START $(date +%H:%M:%S) ==="
  timeout --kill-after=15 1200 node _render_solo_hardened.mjs "$comp" "$s" > "_rlogK_$comp.txt" 2>&1
  echo "  node exit=$? (124=timed out & killed)"
  tail -3 "_rlogK_$comp.txt"
  f="out/$s.mp4"
  if [ -f "$f" ]; then
    v=$("$FF" -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    a=$("$FF" -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    d=$("$FF" -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" 2>/dev/null)
    echo "  FILE OK: $s v=$v a=$a dur=$d $(du -m "$f"|cut -f1)MB"
  else echo "  FILE MISSING: $s"; fi
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== $comp END $(date +%H:%M:%S) ==="
}

render HaiLaComedy19 230-haila-labenh
render HaiLaComedy6 217-haila-thoinhun
render HaiLaComedy7 218-haila-treonang
render HaiLaComedy8 219-haila-bontheomua
echo "KARAOKE_ALL_DONE"
