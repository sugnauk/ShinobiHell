# Generates assets/player_shinobi.png (64x32 = 2 frames of 32x32) by drawing pixel rectangles + auto outline.
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$C = @{ ol='#14101a'; hair='#1a1a24'; skin='#e0b080'; skinD='#b88858'; red='#c8283c'; redD='#8a1a28'; b1='#2a3560'; b2='#3c4a8a'; b3='#6a7cc8'; pant='#1e2650'; brass='#c8a050'; brassD='#7a5e28'; brown='#5a3a22'; gold='#e8c050'; steel='#d8dce8'; shoe='#2a2a36' }
function Col($k) { [System.Drawing.ColorTranslator]::FromHtml($C[$k]) }
$script:cur = $null
function Dot($x, $y, $k) { if ($x -ge 0 -and $x -lt 32 -and $y -ge 0 -and $y -lt 32) { $script:cur.SetPixel($x, $y, (Col $k)) } }
function Rect($x1, $y1, $x2, $y2, $k) { for ($y = $y1; $y -le $y2; $y++) { for ($x = $x1; $x -le $x2; $x++) { Dot $x $y $k } } }

$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$sheet = New-Object System.Drawing.Bitmap 64, 32, $fmt

foreach ($f in 0, 1) {
  $script:cur = New-Object System.Drawing.Bitmap 32, 32, $fmt
  $d = $f   # upper-body bob

  # legs and feet (alternate steps)
  if ($f -eq 0) {
    Rect 11 23 14 29 'pant'; Rect 17 23 20 27 'pant'; Rect 10 29 14 30 'shoe'; Rect 17 27 21 28 'shoe'
  } else {
    Rect 11 23 14 27 'pant'; Rect 17 23 20 29 'pant'; Rect 10 27 14 28 'shoe'; Rect 17 29 21 30 'shoe'
  }
  Rect 11 22 20 24 'pant'

  # sheathed katana at right hip
  Rect 24 25 25 29 'brown'; Dot 24 29 'gold'; Dot 25 29 'gold'; Dot 24 25 'steel'

  # torso
  Rect 10 (15-$d) 21 (21-$d) 'b2'
  Rect 10 (15-$d) 11 (21-$d) 'b1'; Rect 20 (15-$d) 21 (21-$d) 'b1'
  for ($i = 0; $i -le 6; $i++) { Dot (12+$i) (16-$d+[int][math]::Floor($i*0.8)) 'b3' }
  Rect 10 (22-$d) 21 (22-$d) 'redD'; Dot 15 (22-$d) 'gold'; Dot 16 (22-$d) 'gold'

  # arms: left is the brass prosthetic, right is wrapped
  Rect 7 (16-$d) 9 (20-$d) 'b2'; Rect 7 (16-$d) 9 (16-$d) 'b3'
  Rect 7 (21-$d) 9 (24-$d) 'brass'; Rect 7 (25-$d) 9 (25-$d) 'brassD'; Dot 8 (22-$d) 'brassD'
  Rect 22 (16-$d) 24 (20-$d) 'b2'; Rect 22 (16-$d) 24 (16-$d) 'b3'
  Rect 22 (21-$d) 24 (23-$d) 'b1'; Rect 22 (24-$d) 24 (25-$d) 'skin'

  # scarf with swaying tail
  Rect 11 (13-$d) 20 (15-$d) 'red'; Rect 11 (15-$d) 20 (15-$d) 'redD'
  if ($f -eq 0) { Rect 21 (14-$d) 23 (16-$d) 'red'; Rect 22 (17-$d) 23 (19-$d) 'redD' }
  else          { Rect 21 (14-$d) 24 (15-$d) 'red'; Rect 24 (16-$d) 25 (18-$d) 'redD' }

  # head: face, mask, eyes, hair, topknot, headband
  Rect 12 (8-$d) 19 (12-$d) 'skin'; Rect 12 (11-$d) 19 (12-$d) 'b1'
  Dot 14 (10-$d) 'hair'; Dot 17 (10-$d) 'hair'; Dot 14 (9-$d) 'skinD'; Dot 17 (9-$d) 'skinD'
  Rect 11 (5-$d) 20 (6-$d) 'hair'; Rect 11 (7-$d) 12 (9-$d) 'hair'; Rect 19 (7-$d) 20 (9-$d) 'hair'
  Rect 14 (2-$d) 17 (4-$d) 'hair'; Rect 14 (4-$d) 17 (4-$d) 'red'
  Rect 11 (7-$d) 20 (7-$d) 'red'
  if ($f -eq 0) { Rect 21 (7-$d) 23 (8-$d) 'red'; Dot 24 (9-$d) 'redD' }
  else          { Rect 21 (7-$d) 22 (7-$d) 'red'; Rect 22 (8-$d) 23 (9-$d) 'redD' }

  # auto outline: any transparent pixel touching an opaque one (4-neighbour)
  $out = New-Object System.Drawing.Bitmap 32, 32, $fmt
  for ($y = 0; $y -lt 32; $y++) { for ($x = 0; $x -lt 32; $x++) {
    $px = $script:cur.GetPixel($x, $y)
    if ($px.A -gt 0) { $out.SetPixel($x, $y, $px); continue }
    $n = $false
    foreach ($o in @(@(1,0), @(-1,0), @(0,1), @(0,-1))) {
      $nx = $x + $o[0]; $ny = $y + $o[1]
      if ($nx -ge 0 -and $nx -lt 32 -and $ny -ge 0 -and $ny -lt 32 -and $script:cur.GetPixel($nx, $ny).A -gt 0) { $n = $true }
    }
    if ($n) { $out.SetPixel($x, $y, (Col 'ol')) }
  } }
  for ($y = 0; $y -lt 32; $y++) { for ($x = 0; $x -lt 32; $x++) { $sheet.SetPixel($f*32 + $x, $y, $out.GetPixel($x, $y)) } }
}

$dest = Join-Path $root 'assets\player_shinobi.png'
$sheet.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)

# 8x preview with transparent -> dark checker for easy viewing
$pv = New-Object System.Drawing.Bitmap 512, 256, $fmt
$g = [System.Drawing.Graphics]::FromImage($pv)
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#3e4b2e'))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g.DrawImage($sheet, (New-Object System.Drawing.Rectangle 0, 0, 512, 256), (New-Object System.Drawing.Rectangle 0, 0, 64, 32), [System.Drawing.GraphicsUnit]::Pixel)
$pv.Save((Join-Path $root 'player-shinobi-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
"wrote $dest"

