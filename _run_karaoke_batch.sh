#!/bin/bash
# Re-render batch 219-229 (HaiLaComedy8-18) with 2-line karaoke captions.
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

render HaiLaComedy8  219-haila-bonmua
render HaiLaComedy9  220-haila-tuoinuoc
render HaiLaComedy10 221-haila-phongnam
render HaiLaComedy11 222-haila-anhsang
render HaiLaComedy12 223-haila-thonggio
render HaiLaComedy13 224-haila-giathe
render HaiLaComedy14 225-haila-thuanlan
render HaiLaComedy15 226-haila-kichre
render HaiLaComedy16 227-haila-vangla
render HaiLaComedy17 228-haila-chongnang
render HaiLaComedy18 229-haila-muamua
echo "KARAOKE_BATCH_DONE"
