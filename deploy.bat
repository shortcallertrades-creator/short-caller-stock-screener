@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo  SHORT CALLER STOCK SCREENER
echo  AUTOMATED DEPLOYMENT TO VERCEL
echo ============================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
echo [STEP 1] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed
node --version
echo.

REM Install dependencies
echo [STEP 2] Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Install express and dotenv if not present
echo [STEP 3] Installing express and dotenv...
call npm install express dotenv
echo ✓ express and dotenv ready
echo.

REM Check if Vercel CLI is installed
echo [STEP 4] Checking Vercel CLI installation...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ! Vercel CLI not found. Installing now...
    call npm install -g vercel
    if errorlevel 1 (
        echo ERROR: Failed to install Vercel CLI
        echo Try running: npm install -g vercel
        pause
        exit /b 1
    )
)
echo ✓ Vercel CLI is available
vercel --version
echo.

REM Show deployment info
echo [STEP 5] Deployment Information
echo ==========================================
echo Your site will be deployed to Vercel with:
echo - Project: short-caller-stock-screener
echo - Domain: https://short-caller-stock-screener.vercel.app
echo - Server: Node.js (Express)
echo - Updates: Automatic with TikTok integration
echo.

REM Create .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating .env configuration file...
    (
        echo # TikTok API Configuration
        echo TIKTOK_ACCESS_TOKEN=
        echo.
        echo # Public URL
        echo PUBLIC_URL=https://short-caller-stock-screener.vercel.app
    ) > .env
    echo ✓ .env file created
    echo.
    echo IMPORTANT: Add your TikTok access token to .env file
    echo.
)

REM Start deployment
echo [STEP 6] Starting Vercel deployment...
echo.
echo Note: You'll need to log in to Vercel in your browser
echo If you don't have an account, create one at: https://vercel.com
echo.
pause

REM Run Vercel deployment
call vercel --prod

if errorlevel 1 (
    echo.
    echo ✗ Deployment failed
    echo Try these troubleshooting steps:
    echo 1. Make sure you're logged in: vercel login
    echo 2. Check your internet connection
    echo 3. Run manually: vercel --prod
    pause
    exit /b 1
)

echo.
echo ============================================
echo  ✓ DEPLOYMENT SUCCESSFUL!
echo ============================================
echo.
echo Your site is now live!
echo Check your terminal output above for the URL.
echo.
echo Next steps:
echo 1. Get your TikTok access token from https://developer.tiktok.com
echo 2. Add it to your .env file: TIKTOK_ACCESS_TOKEN=your_token_here
echo 3. Configure TikTok redirect URL in developer dashboard
echo 4. Run daily updates with: npm run update-charts
echo.
pause
