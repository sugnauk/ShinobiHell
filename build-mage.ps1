# Generates assets/player_mage.png (64x32 = 2 frames) : onmyoji spirit mage.
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$OL = '#14101a'; $SKIN = '#e0b080'
$script:cur = $null
function Col($h) { [System.Drawing.ColorTranslator]::FromHtml($h) }
function Dot($x, $y, $c) { if ($x -ge 0 -and $x -lt 32 -and $y -ge 0 -and $y -lt 32) { $script:cur.SetPixel($x, $y, (Col $c)) } }
function Rect($x1, $y1, $x2, $y2, $c) { for ($y = $y1; $y -le $y2; $y++) { for ($x = $x1; $x -le $x2; $x++) { Dot $x $y $c } } }

$sheet = New-Object System.Drawing.Bitmap 64, 32, $fmt
foreach ($f in 0, 1) {
  $script:cur = New-Object System.Drawing.Bitmap 32, 32, $fmt
  $d = $f
  # hakama + feet
  Rect 10 24 21 28 '#2a3a8a'; Rect 10 24 11 28 '#1a2468'; Rect 20 24 21 28 '#1a2468'; Rect 15 25 16 28 '#1a2468'
  if ($f -eq 0) { Rect 11 29 14 30 '#2a2a36'; Rect 17 29 20 30 '#2a2a36' } else { Rect 12 29 15 30 '#2a2a36'; Rect 16 29 19 30 '#2a2a36' }
  # robe
  Rect 10 (15-$d) 21 (23-$d) '#e8e8f0'; Rect 10 (15-$d) 11 (23-$d) '#b8bccc'; Rect 20 (15-$d) 21 (23-$d) '#b8bccc'
  Rect 15 (15-$d) 16 (22-$d) '#2a3a8a'
  Rect 10 (22-$d) 21 (23-$d) '#c8283c'; Dot 15 (22-$d) '#e8c050'; Dot 16 (22-$d) '#e8c050'
  # wide sleeves
  Rect 5 (16-$d) 9 (24-$d) '#e8e8f0'; Rect 5 (16-$d) 5 (24-$d) '#b8bccc'; Rect 5 (23-$d) 9 (24-$d) '#2a3a8a'
  Rect 22 (16-$d) 26 (24-$d) '#e8e8f0'; Rect 26 (16-$d) 26 (24-$d) '#b8bccc'; Rect 22 (23-$d) 26 (24-$d) '#2a3a8a'
  # held talisman (right) and floating fire orb (left)
  Rect 27 (16-$d) 28 (21-$d) '#f8f4e8'; Dot 27 (18-$d) '#c8283c'; Dot 28 (19-$d) '#c8283c'
  $oy = 14 - $f
  Rect 2 $oy 3 ($oy+1) '#ff8a30'; Dot 2 $oy '#ffffff'; Dot 1 ($oy-1) '#ffb050'; Dot 4 ($oy+2) '#ff6020'
  # long silver hair + face
  Rect 11 (7-$d) 12 (16-$d) '#d0d4e4'; Rect 19 (7-$d) 20 (16-$d) '#d0d4e4'
  Rect 12 (8-$d) 19 (12-$d) $SKIN; Dot 14 (10-$d) $OL; Dot 17 (10-$d) $OL; Dot 15 (12-$d) '#a05040'; Dot 16 (12-$d) '#a05040'
  Rect 13 (13-$d) 18 (14-$d) '#c8283c'
  # eboshi hat with red band + talisman tag
  Rect 13 (2-$d) 18 (3-$d) '#1a1a24'; Rect 12 (4-$d) 19 (7-$d) '#1a1a24'; Rect 12 (6-$d) 19 (6-$d) '#c8283c'
  Rect 14 (8-$d) 17 (9-$d) '#f8f4e8'; Dot 15 (8-$d) '#c8283c'

  # outline
  for ($y = 0; $y -lt 32; $y++) { for ($x = 0; $x -lt 32; $x++) {
    $px = $script:cur.GetPixel($x, $y)
    if ($px.A -gt 0) { $sheet.SetPixel($f*32 + $x, $y, $px); continue }
    $n = $false
    foreach ($o in @(@(1,0), @(-1,0), @(0,1), @(0,-1))) {
      $nx = $x + $o[0]; $ny = $y + $o[1]
      if ($nx -ge 0 -and $nx -lt 32 -and $ny -ge 0 -and $ny -lt 32 -and $script:cur.GetPixel($nx, $ny).A -gt 0) { $n = $true }
    }
    if ($n) { $sheet.SetPixel($f*32 + $x, $y, (Col $OL)) }
  } }
}
$sheet.Save((Join-Path $root 'assets\player_mage.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$pv = New-Object System.Drawing.Bitmap 512, 256, $fmt
$g = [System.Drawing.Graphics]::FromImage($pv); $g.Clear((Col '#3e4b2e'))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g.DrawImage($sheet, (New-Object System.Drawing.Rectangle 0, 0, 512, 256), (New-Object System.Drawing.Rectangle 0, 0, 64, 32), [System.Drawing.GraphicsUnit]::Pixel)
$pv.Save((Join-Path $root 'player-mage-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
'done'
