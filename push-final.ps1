#!/usr/bin/env pwsh

$gitExe = "C:\Program Files\Git\bin\git.exe"

Write-Host "Updating remote URL..." -ForegroundColor Yellow
& $gitExe remote set-url origin https://github.com/shortcallertrades-creator/short-caller-stock-screener.git

Write-Host "Checking remote..." -ForegroundColor Yellow
& $gitExe remote -v

Write-Host "`nChecking git status..." -ForegroundColor Yellow
& $gitExe status

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may open a browser for authentication..." -ForegroundColor Cyan
& $gitExe push -u origin main -v

Write-Host "`nDone!" -ForegroundColor Green
