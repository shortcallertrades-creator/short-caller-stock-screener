@echo off
REM Vercel Deployment Script

echo.
echo ===== VERCEL DEPLOYMENT =====
echo.

cd /d "c:\Users\Dell\New folder"

echo Step 1: Checking Vercel installation...
"C:\Program Files\nodejs\npx.cmd" vercel --version

echo.
echo Step 2: Deploying to Vercel...
echo This will open your browser for authentication.
echo.
pause

"C:\Program Files\nodejs\npx.cmd" vercel

echo.
echo Deployment complete!
echo Your site is now live on Vercel!
echo.
pause
