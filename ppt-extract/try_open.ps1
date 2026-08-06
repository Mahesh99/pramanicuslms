$app = New-Object -ComObject PowerPoint.Application
$f = "C:\Users\Mahesh\Desktop\c ppts\UNIT std lib macros.ppt"
try {
  $pres = $app.Presentations.Open($f, $true, $false, $true)
  Write-Output "Opened OK, slides: $($pres.Slides.Count)"
  $pres.Close()
} catch {
  Write-Output "FAILED: $($_.Exception.Message)"
}
$app.Quit()
