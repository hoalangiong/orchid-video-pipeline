@echo off
title Web Tao Video Hoa Lan
cd /d "%~dp0"

echo ============================================
echo   WEB TAO VIDEO HOA LAN
echo ============================================
echo.
echo Dang khoi dong server...
echo Trang web se tu mo trong trinh duyet.
echo.
echo DUNG DONG CUA SO NAY trong luc dang tao video.
echo De tat: bam Ctrl+C hoac dong cua so.
echo.

start "" http://localhost:3200
npx tsx server/index.ts

echo.
echo Server da dung. Bam phim bat ky de dong.
pause >nul
