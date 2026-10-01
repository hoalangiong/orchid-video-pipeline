#!/bin/bash
# Render tap 217 (haila6 - thoi nhun benh vi khuan) voi config hardened.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
FF="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffprobe.exe"
s="217-haila-thoinhun"; comp="HaiLaComedy6"
powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
echo "=== HD haila6 ($s) START $(date +%H:%M:%S) ==="
timeout --kill-after=15 1200 node _render_solo_hardened.mjs "$comp" "$s" > "_rlogHD_6.txt" 2>&1
echo "  node exit=$? (124=timed out & killed)"
tail -4 "_rlogHD_6.txt"
f="out/$s.mp4"
if [ -f "$f" ]; then
  v=$("$FF" -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
  a=$("$FF" -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
  d=$("$FF" -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" 2>/dev/null)
  echo "  FILE OK: $s v=$v a=$a dur=$d $(du -m "$f"|cut -f1)MB"
else echo "  FILE MISSING: $s"; fi
powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
echo "=== HD haila6 END $(date +%H:%M:%S) ==="
echo "HD6_DONE"
