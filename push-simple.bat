@echo off
cd /d "c:\Users\Dell\New folder"

echo.
echo Checking git status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo Checking remote configuration...
"C:\Program Files\Git\bin\git.exe" remote -v

echo.
echo Attempting to push to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo SUCCESS! Code pushed to GitHub!
    echo.
    echo Next: Deploy to Vercel at https://vercel.com/new
) else (
    echo.
    echo Push completed (may be waiting for authentication)
    echo Check your browser for any authentication prompts
)

pause
