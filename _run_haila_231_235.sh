#!/bin/bash
# Render HaiLa 231-235 (HaiLaComedy20-24) with karaoke captions.
# Sequential (shared _fixedbundle) + kill chrome-headless-shell between each.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1

render() {
  local COMP="$1"; local SLUG="$2"
  echo "=========== $COMP -> $SLUG ==========="
  taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
  sleep 2
  node _render_solo_hardened.mjs "$COMP" "$SLUG"
  local rc=$?
  taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
  sleep 1
  echo "--- $SLUG exit=$rc ---"
}

render HaiLaComedy20 231-haila-sailam
render HaiLaComedy21 232-haila-nuocvogao
render HaiLaComedy22 233-haila-cuulan
render HaiLaComedy23 234-haila-vochuoi
render HaiLaComedy24 235-haila-nodungtet
echo "HAILA_231_235_DONE"
