param(
  [string]$FilePath,
  [string]$OutPath
)

$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($FilePath, $true, $false, $true)
$sb = New-Object System.Text.StringBuilder
$slideIdx = 0
foreach ($slide in $pres.Slides) {
  $slideIdx++
  [void]$sb.AppendLine("=== SLIDE $slideIdx ===")
  foreach ($shape in $slide.Shapes) {
    if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
      [void]$sb.AppendLine($shape.TextFrame.TextRange.Text)
    }
    if ($shape.HasTable) {
      $tbl = $shape.Table
      for ($r = 1; $r -le $tbl.Rows.Count; $r++) {
        $rowVals = @()
        for ($c = 1; $c -le $tbl.Columns.Count; $c++) {
          $rowVals += $tbl.Cell($r, $c).Shape.TextFrame.TextRange.Text
        }
        [void]$sb.AppendLine(($rowVals -join " | "))
      }
    }
  }
  if ($slide.HasNotesPage) {
    foreach ($ns in $slide.NotesPage.Shapes) {
      if ($ns.HasTextFrame -and $ns.TextFrame.HasText -and $ns.Type -ne 13) {
        $t = $ns.TextFrame.TextRange.Text
        if ($t -and $t.Trim().Length -gt 0 -and $t -notmatch "^\d+$") {
          [void]$sb.AppendLine("--- NOTES ---")
          [void]$sb.AppendLine($t)
        }
      }
    }
  }
}
[System.IO.File]::WriteAllText($OutPath, $sb.ToString())
$pres.Close()
$app.Quit()
Write-Output "DONE"
