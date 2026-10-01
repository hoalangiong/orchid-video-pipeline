#!/bin/bash
# Guarded sequential re-render of haila13-18 (ep 224-229).
# Fix for the ~33h freeze: no blocking `| tail` pipe; redirect to per-render log;
# wrap in `timeout` so a post-render Chrome hang gets killed instead of blocking
# the queue. The mp4 is fully written before any hang, so a killed-after-DONE
# render still yields a valid file — verify by ffprobe, not by exit code.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
FF="/c/Users/Dell Precision 5560/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffprobe.exe"

declare -A SLUG=(
 [13]="224-haila-giathe" [14]="225-haila-thuanlan" [15]="226-haila-kichre"
 [16]="227-haila-vangla" [17]="228-haila-chongnang" [18]="229-haila-muamua")

for n in 13 14 15 16 17 18; do
  s="${SLUG[$n]}"
  echo "=== RENDER haila$n ($s) START $(date +%H:%M:%S) ==="
  # 900s hard cap (normal ~8min); --kill-after sends SIGKILL if it ignores TERM
  timeout --kill-after=15 900 node "_render_haila$n.mjs" > "_rlog_$n.txt" 2>&1
  rc=$?
  echo "  node exit=$rc (124=timed out & killed)"
  tail -3 "_rlog_$n.txt"
  # verify by file regardless of exit code
  f="out/$s.mp4"
  if [ -f "$f" ]; then
    v=$("$FF" -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    a=$("$FF" -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$f" 2>/dev/null)
    d=$("$FF" -v error -show_entries format=duration -of default=nw=1:nk=1 "$f" 2>/dev/null)
    echo "  FILE OK: $s v=$v a=$a dur=$d $(du -m "$f"|cut -f1)MB"
  else
    echo "  FILE MISSING: $s — render truly failed"
  fi
  # kill any lingering headless chrome so it can't block the next render
  powershell.exe -NoProfile -Command "Stop-Process -Name chrome-headless-shell -Force -ErrorAction SilentlyContinue" 2>/dev/null
  echo "=== RENDER haila$n END $(date +%H:%M:%S) ==="
done
echo "ALL_RERENDERS_DONE"
