cd "c:\Users\Dell\New folder"
$start = Get-Date
try {
    & node update_charts.js 2>&1 | Tee-Object -FilePath "script_output.txt"
    Write-Host "Script completed successfully"
} catch {
    Write-Host "Error: $_"
    $_ | Out-File -FilePath "script_error.txt"
}
$end = Get-Date
Write-Host "Duration: $(($end - $start).TotalSeconds) seconds"
