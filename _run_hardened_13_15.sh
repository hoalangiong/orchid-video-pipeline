#!/bin/bash
# Hardened re-render of the 3 crashed episodes (224/225/226) one at a time.
# Uses _render_solo_hardened.mjs (swiftshader GL + capped video cache) to beat
# the "Page crashed!" Chromium OOM/GPU crash. Verify by ffprobe, not exit code.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
FF="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffprobe.exe"

declare -A SLUG=( [13]="224-haila-giathe" [14]="225-haila-thuanlan" [15]="226-haila-kichre" )

for n in 13 14 15; do
  s="${SLUG[$n]}"
  comp="HaiLaComedy$n"
  # clean slate: no leftover headless chrome eating RAM before we start
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== HARDENED haila$n ($s) START $(date +%H:%M:%S) ==="
  # 1200s cap (hardened swiftshader is slower than GPU path); kill if it hangs post-DONE
  timeout --kill-after=15 1200 node _render_solo_hardened.mjs "$comp" "$s" > "_rlogH_$n.txt" 2>&1
  rc=$?
  echo "  node exit=$rc (124=timed out & killed)"
  tail -4 "_rlogH_$n.txt"
  f="out/$s.mp4"
  if [ -f "$f" ]; then
    v=$("$FF" -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    a=$("$FF" -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    d=$("$FF" -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" 2>/dev/null)
    echo "  FILE OK: $s v=$v a=$a dur=$d $(du -m "$f"|cut -f1)MB"
  else
    echo "  FILE MISSING: $s — hardened render still failed"
  fi
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== HARDENED haila$n END $(date +%H:%M:%S) ==="
done
echo "ALL_HARDENED_DONE"
