#!/usr/bin/env pwsh

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  SHORT CALLER STOCK SCREENER" -ForegroundColor Cyan
Write-Host "  AUTOMATED DEPLOYMENT TO VERCEL" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Push-Location $PSScriptRoot

# Step 1: Check Node.js
Write-Host "[STEP 1] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Install dependencies
Write-Host "`n[STEP 2] Installing npm dependencies..." -ForegroundColor Yellow
& npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 3: Install express and dotenv
Write-Host "`n[STEP 3] Installing express and dotenv..." -ForegroundColor Yellow
& npm install express dotenv
Write-Host "✓ express and dotenv ready" -ForegroundColor Green

# Step 4: Check Vercel CLI
Write-Host "`n[STEP 4] Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = & vercel --version
    Write-Host "✓ Vercel CLI is available: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "! Vercel CLI not found. Installing now..." -ForegroundColor Yellow
    & npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ ERROR: Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Try running: npm install -g vercel" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
}

# Step 5: Show deployment info
Write-Host "`n[STEP 5] Deployment Information" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "Your site will be deployed to Vercel with:" -ForegroundColor White
Write-Host "  - Project: short-caller-stock-screener" -ForegroundColor Cyan
Write-Host "  - Domain: https://short-caller-stock-screener.vercel.app" -ForegroundColor Cyan
Write-Host "  - Server: Node.js (Express)" -ForegroundColor Cyan
Write-Host "  - Updates: Automatic with TikTok integration" -ForegroundColor Cyan

# Step 6: Create .env if needed
if (-not (Test-Path .env)) {
    Write-Host "`nCreating .env configuration file..." -ForegroundColor Yellow
    @"
# TikTok API Configuration
TIKTOK_ACCESS_TOKEN=

# Public URL
PUBLIC_URL=https://short-caller-stock-screener.vercel.app
"@ | Out-File -Encoding utf8 .env
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "`n⚠ IMPORTANT: Add your TikTok access token to .env file" -ForegroundColor Yellow
}

# Step 7: Ready for deployment
Write-Host "`n[STEP 6] Starting Vercel deployment..." -ForegroundColor Yellow
Write-Host "`nNote: You'll need to log in to Vercel in your browser" -ForegroundColor Cyan
Write-Host "If you don't have an account, create one at: https://vercel.com`n" -ForegroundColor Cyan
Read-Host "Press Enter to continue with deployment"

# Run deployment
& vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Deployment failed" -ForegroundColor Red
    Write-Host "`nTroubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're logged in: vercel login" -ForegroundColor Gray
    Write-Host "2. Check your internet connection" -ForegroundColor Gray
    Write-Host "3. Run manually: vercel --prod" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

# Success!
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  ✓ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green
Write-Host "Your site is now live!" -ForegroundColor Green
Write-Host "Check your terminal output above for the URL.`n" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Get your TikTok access token from https://developer.tiktok.com" -ForegroundColor Gray
Write-Host "2. Add it to your .env file: TIKTOK_ACCESS_TOKEN=your_token_here" -ForegroundColor Gray
Write-Host "3. Configure TikTok redirect URL in developer dashboard" -ForegroundColor Gray
Write-Host "4. Run daily updates with: npm run update-charts`n" -ForegroundColor Gray

Pop-Location
Read-Host "Press Enter to exit"
