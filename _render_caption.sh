#!/usr/bin/env bash
# Render lại toàn bộ video hệ CONFIGS với chữ caption (Hướng D auto-split).
# Ra out/_caption/<slug>.mp4, KHÔNG đụng file cũ. Bỏ qua cái đã render.
set -u
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video"
DEST="out/_caption"
LOG="_render_caption.log"
mkdir -p "$DEST"

# Private temp dir so Remotion's audio-mixing scratch (remotion-v4.0.490-assets*)
# lives outside the shared TEMP and never gets globbed away mid-render.
RTMP="$(pwd)/_captiontmp"
mkdir -p "$RTMP"
export TMPDIR="$RTMP" TEMP="$RTMP" TMP="$RTMP"

# Lấy danh sách slug từ configs (thứ tự mảng)
mapfile -t SLUGS < <(grep -oE 'slug:\s*"[^"]+"' src/nhaDamConfigs.tsx | sed 's/slug:\s*"//;s/"//')
TOTAL=${#SLUGS[@]}
echo "=== START $(date) — $TOTAL slugs ===" | tee -a "$LOG"

i=0; done=0; skip=0; fail=0
for slug in "${SLUGS[@]}"; do
  i=$((i+1))
  OUTF="$DEST/$slug.mp4"
  # Bỏ qua nếu đã render (>1MB = hợp lệ)
  if [ -f "$OUTF" ]; then
    sz=$(stat -c%s "$OUTF" 2>/dev/null || echo 0)
    if [ "$sz" -gt 1000000 ]; then
      skip=$((skip+1)); echo "[$i/$TOTAL] SKIP $slug (đã có, ${sz}b)" | tee -a "$LOG"; continue
    fi
  fi
  echo "[$i/$TOTAL] RENDER $slug ..." | tee -a "$LOG"
  rm -rf "$LOCALAPPDATA"/Temp/remotion-* 2>/dev/null
  npx remotion render "$slug" "$OUTF" --props='{}' --concurrency=1 --timeout=180000 >/dev/null 2>>"$LOG"
  rc=$?
  if [ $rc -eq 0 ] && [ -f "$OUTF" ]; then
    done=$((done+1)); echo "[$i/$TOTAL] OK $slug" | tee -a "$LOG"
  else
    fail=$((fail+1)); echo "[$i/$TOTAL] FAIL $slug (rc=$rc)" | tee -a "$LOG"
  fi
done
echo "=== DONE $(date) — ok=$done skip=$skip fail=$fail total=$TOTAL ===" | tee -a "$LOG"
