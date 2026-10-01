@echo off
title Orchid Video Server
cd /d "%~dp0"
echo Starting Orchid Video Server...
echo.
npx tsx server/index.ts
pause
