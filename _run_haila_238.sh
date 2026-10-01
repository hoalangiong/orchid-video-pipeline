#!/bin/bash
# Render tap 238 (HaiLaComedy27): hook manh + footage goc + SFX foley + karaoke.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 2
node _render_solo_hardened.mjs HaiLaComedy27 238-haila-thoinhun
rc=$?
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 1
echo "--- 238 exit=$rc ---"
echo "HAILA_238_DONE"
