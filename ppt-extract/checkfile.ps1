$f = "C:\Users\Mahesh\Desktop\c ppts\UNIT std lib macros.ppt"
$bytes = [System.IO.File]::ReadAllBytes($f)
$first16 = $bytes[0..15]
($first16 | ForEach-Object { $_.ToString("X2") }) -join " "
