#!/bin/bash
# Render demo tap 236 (HaiLaComedy25): hook re + SFX foley + karaoke.
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video" || exit 1
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 2
node _render_solo_hardened.mjs HaiLaComedy25 236-haila-lanhan
rc=$?
taskkill //F //IM chrome-headless-shell.exe //T >/dev/null 2>&1
sleep 1
echo "--- 236 exit=$rc ---"
echo "HAILA_236_DONE"
