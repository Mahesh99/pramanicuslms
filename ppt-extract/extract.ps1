param(
  [string]$SrcDir = "C:\Users\Mahesh\Desktop\c ppts",
  [string]$OutDir = "C:\Users\Mahesh\myprojects\pramanicuslms\ppt-extract"
)

$app = New-Object -ComObject PowerPoint.Application
$files = Get-ChildItem -Path $SrcDir -File | Where-Object { $_.Extension -in ".ppt", ".pptx" }

foreach ($f in $files) {
  $outPath = Join-Path $OutDir ($f.BaseName + ".txt")
  Write-Output "Processing: $($f.Name)"
  try {
    $pres = $app.Presentations.Open($f.FullName, [Type]::Missing, [Type]::Missing, 0)
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
        $notesShapes = $slide.NotesPage.Shapes
        foreach ($ns in $notesShapes) {
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
    [System.IO.File]::WriteAllText($outPath, $sb.ToString())
    $pres.Close()
  } catch {
    Write-Output "ERROR on $($f.Name): $_"
  }
}

$app.Quit()
Write-Output "ALL DONE"
