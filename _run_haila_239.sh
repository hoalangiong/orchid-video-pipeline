#!/bin/bash
# Render tap 239 (HaiLaComedy28): hook contrarian la vang + footage goc + SFX + karaoke.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 2
node _render_solo_hardened.mjs HaiLaComedy28 239-haila-lavang
rc=$?
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 1
echo "--- 239 exit=$rc ---"
echo "HAILA_239_DONE"
