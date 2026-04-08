#!/usr/bin/env pwsh

# Find Git executable
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "C:\Program Files\Git\cmd\git.exe"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitExe = $path
        break
    }
}

if (-not $gitExe) {
    Write-Host "ERROR: Git not found. Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host "Found Git at: $gitExe" -ForegroundColor Green

Set-Location "c:\Users\Dell\New folder"

Write-Host "Configuring Git..." -ForegroundColor Yellow
& $gitExe config user.name "shortcallertrades"
& $gitExe config user.email "shortcallertrades@gmail.com"

Write-Host "Checking for existing remote..." -ForegroundColor Yellow
$remotes = & $gitExe remote
if ($remotes -contains "origin") {
    Write-Host "Removing existing origin..." -ForegroundColor Yellow
    & $gitExe remote remove origin
}

Write-Host "Setting up branch..." -ForegroundColor Yellow
& $gitExe branch -M main

Write-Host "Adding GitHub origin..." -ForegroundColor Yellow
& $gitExe remote add origin https://github.com/shortcallertrades/short-caller-stock-screener.git

Write-Host "Staging files..." -ForegroundColor Yellow
& $gitExe add .

Write-Host "Committing changes..." -ForegroundColor Yellow
& $gitExe commit -m "Deploy to Vercel - Stock screener with TikTok integration ready"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
& $gitExe push -u origin main

Write-Host "Success! Code pushed to GitHub." -ForegroundColor Green
Write-Host "Next: Go to https://vercel.com/new to deploy" -ForegroundColor Cyan
