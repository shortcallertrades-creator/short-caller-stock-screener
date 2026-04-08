#!/usr/bin/env pwsh
# =============================================================================
# SHORT CALLER STOCK SCREENER - AUTOMATED VERCEL DEPLOYMENT SCRIPT
# =============================================================================

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SHORT CALLER STOCK SCREENER - VERCEL DEPLOYMENT             ║" -ForegroundColor Cyan
Write-Host "║   Automatic deployment to production                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Step 1: Configure Git
Write-Host "[STEP 1/5] Configuring Git..." -ForegroundColor Yellow
Write-Host "Setting git user name and email..." -ForegroundColor Gray

$username = "shortcallertrades"
$email = "shortcallertrades@gmail.com"

& git config user.name $username
& git config user.email $email

Write-Host "✓ Git configured for: $username <$email>" -ForegroundColor Green
Write-Host ""

# Step 2: Check Git Status
Write-Host "[STEP 2/5] Checking repository status..." -ForegroundColor Yellow

$status = & git status --porcelain
if ($status) {
    Write-Host "Found uncommitted changes:  " -ForegroundColor Gray
    Write-Host $status -ForegroundColor White
    Write-Host ""
    Write-Host "Adding all changes..." -ForegroundColor Gray
    & git add .
    Write-Host "✓ All files staged" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Committing changes..." -ForegroundColor Gray
    & git commit -m "Deploy to Vercel - TikTok integration complete"
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✓ Repository clean - no uncommitted changes" -ForegroundColor Green
}
Write-Host ""

# Step 3: Show repository setup
Write-Host "[STEP 3/5] Repository Status" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
& git log --oneline -5
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Step 4: Instructions for GitHub
Write-Host "[STEP 4/5] GitHub Setup Instructions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Your code is ready to push! Follow these steps:" -ForegroundColor White
Write-Host ""
Write-Host "METHOD A: Using GitHub CLI (Easiest)" -ForegroundColor Cyan
Write-Host "  1. Download GitHub CLI: " -ForegroundColor Gray -NoNewline
Write-Host "https://cli.github.com" -ForegroundColor Blue
Write-Host "  2. Run these commands:" -ForegroundColor Gray
Write-Host ""
Write-Host "     gh auth login" -ForegroundColor White
Write-Host "     gh repo create short-caller-stock-screener --public --source=. --remote=origin --push" -ForegroundColor White
Write-Host ""
Write-Host "METHOD B: Using GitHub Website (Also Easy)" -ForegroundColor Cyan
Write-Host "  1. Go to: " -ForegroundColor Gray -NoNewline
Write-Host "https://github.com/new" -ForegroundColor Blue
Write-Host "  2. Create repo named: " -ForegroundColor Gray -NoNewline
Write-Host "short-caller-stock-screener" -ForegroundColor White
Write-Host "  3. Run these commands:" -ForegroundColor Gray
Write-Host ""
Write-Host "     git branch -M main" -ForegroundColor White
Write-Host "     git remote add origin https://github.com/shortcallertrades/short-caller-stock-screener.git" -ForegroundColor White
Write-Host "     git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Step 5: Vercel Instructions
Write-Host "[STEP 5/5] Vercel Deployment Instructions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "After pushing to GitHub:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Go to: " -ForegroundColor Gray -NoNewline
Write-Host "https://vercel.com/new" -ForegroundColor Blue
Write-Host ""
Write-Host "  2. Click 'Import Git Repository'" -ForegroundColor White
Write-Host ""
Write-Host "  3. Search for: " -ForegroundColor Gray -NoNewline
Write-Host "short-caller-stock-screener" -ForegroundColor White
Write-Host ""
Write-Host "  4. Click Import and Deploy" -ForegroundColor White
Write-Host ""
Write-Host "  5. Your site goes LIVE! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✓ CODE IS READY FOR DEPLOYMENT                             ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 DEPLOYMENT CHECKLIST:" -ForegroundColor Yellow
Write-Host "  ☐ Create GitHub repository (https://github.com/new)" -ForegroundColor Gray
Write-Host "  ☐ Push code to GitHub (git push -u origin main)" -ForegroundColor Gray
Write-Host "  ☐ Go to Vercel (https://vercel.com/new)" -ForegroundColor Gray
Write-Host "  ☐ Import GitHub repository" -ForegroundColor Gray
Write-Host "  ☐ Deploy to Vercel" -ForegroundColor Gray
Write-Host "  ☐ Get TikTok access token" -ForegroundColor Gray
Write-Host "  ☐ Add token to Vercel environment variables" -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 2
Write-Host "Ready to continue? Press Enter or open the links above..." -ForegroundColor Cyan
Read-Host | Out-Null
