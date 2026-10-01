#!/bin/bash
# Render tap 237 (HaiLaComedy26): hook manh + footage goc + SFX foley + karaoke.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 2
node _render_solo_hardened.mjs HaiLaComedy26 237-haila-khongrahoa
rc=$?
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 1
echo "--- 237 exit=$rc ---"
echo "HAILA_237_DONE"
