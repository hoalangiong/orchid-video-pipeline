#!/bin/bash
# Re-render 2 tap mo nhat sau khi thay nen HD 1080+: haila10 (221-phongnam), haila15 (226-kichre).
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
FF="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffprobe.exe"
declare -A SLUG=( [10]="221-haila-phongnam" [15]="226-haila-kichre" )
for n in 10 15; do
  s="${SLUG[$n]}"; comp="HaiLaComedy$n"
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== HD haila$n ($s) START $(date +%H:%M:%S) ==="
  timeout --kill-after=15 1200 node _render_solo_hardened.mjs "$comp" "$s" > "_rlogHD_$n.txt" 2>&1
  echo "  node exit=$? (124=timed out & killed)"
  tail -4 "_rlogHD_$n.txt"
  f="out/$s.mp4"
  if [ -f "$f" ]; then
    v=$("$FF" -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    a=$("$FF" -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    d=$("$FF" -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" 2>/dev/null)
    echo "  FILE OK: $s v=$v a=$a dur=$d $(du -m "$f"|cut -f1)MB"
  else echo "  FILE MISSING: $s"; fi
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== HD haila$n END $(date +%H:%M:%S) ==="
done
echo "ALL_HD_DONE"
