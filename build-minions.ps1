# Generates assets/e_<type>.png (2-frame walk sheets) for the six minion types + a preview image.
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$OL = '#14101a'; $SKIN = '#e0b080'; $SHOE = '#2a2a36'; $STEEL = '#d8dce8'; $WOOD = '#7a5a30'
$script:cur = $null; $script:W = 32; $script:H = 32
function Col($h) { [System.Drawing.ColorTranslator]::FromHtml($h) }
function Dot($x, $y, $c) { if ($x -ge 0 -and $x -lt $script:W -and $y -ge 0 -and $y -lt $script:H) { $script:cur.SetPixel($x, $y, (Col $c)) } }
function Rect($x1, $y1, $x2, $y2, $c) { for ($y = $y1; $y -le $y2; $y++) { for ($x = $x1; $x -le $x2; $x++) { Dot $x $y $c } } }

function Legs($f, $pant, $shoe) {
  if ($f -eq 0) { Rect 11 23 14 29 $pant; Rect 17 23 20 27 $pant; Rect 10 29 14 30 $shoe; Rect 17 27 21 28 $shoe }
  else          { Rect 11 23 14 27 $pant; Rect 17 23 20 29 $pant; Rect 10 27 14 28 $shoe; Rect 17 29 21 30 $shoe }
  Rect 11 22 20 24 $pant
}
function Torso($d, $c, $dark, $belt) {
  Rect 10 (15-$d) 21 (21-$d) $c; Rect 10 (15-$d) 11 (21-$d) $dark; Rect 20 (15-$d) 21 (21-$d) $dark; Rect 10 (22-$d) 21 (22-$d) $belt
}
function Arms($d, $sleeve, $hand) {
  Rect 7 (16-$d) 9 (22-$d) $sleeve; Rect 7 (23-$d) 9 (24-$d) $hand
  Rect 22 (16-$d) 24 (22-$d) $sleeve; Rect 22 (23-$d) 24 (24-$d) $hand
}
function Face($d, $skin) { Rect 12 (8-$d) 19 (12-$d) $skin; Dot 14 (10-$d) $OL; Dot 17 (10-$d) $OL }
function Kasa($d, $c, $shade) {
  Rect 14 (2-$d) 17 (2-$d) $c; Rect 12 (3-$d) 19 (3-$d) $c; Rect 10 (4-$d) 21 (5-$d) $c
  Rect 9 (6-$d) 22 (6-$d) $shade; Rect 12 (7-$d) 19 (7-$d) $shade
}

function Ashigaru($f) {
  $d = $f
  Legs $f '#5a4a30' $SHOE
  Torso $d '#7a5a34' '#5a3e22' '#3a2a1a'
  for ($y = 16; $y -le 20; $y += 2) { Rect 12 ($y-$d) 19 ($y-$d) '#9a7a4c' }
  Arms $d '#6a4a2a' $SKIN
  Face $d $SKIN
  Kasa $d '#c8a860' '#8a6a38'
  # spear
  Rect 26 4 26 28 $WOOD; Rect 25 0 27 3 $STEEL; Dot 26 0 '#ffffff'; Rect 25 5 27 5 '#c8283c'
}
function Archer($f) {
  $d = $f
  Legs $f '#3a4a30' $SHOE
  Torso $d '#4a6a3a' '#2e4a24' '#2a3a1a'
  Arms $d '#3e5a30' $SKIN
  Face $d $SKIN
  Kasa $d '#8a9a60' '#5a6a3a'
  # quiver and arrow tips
  Rect 20 12 22 16 '#5a3a22'; Dot 20 11 $STEEL; Dot 22 11 $STEEL
  # bow with string
  Dot 6 8 '#7a5a30'; Dot 5 9 '#7a5a30'; Rect 4 10 4 22 '#7a5a30'; Dot 5 23 '#7a5a30'; Dot 6 24 '#7a5a30'
  Rect 6 9 6 23 '#e8e8e8'
}
function Samurai($f) {
  $d = $f
  Legs $f '#2a2a30' '#1a1a22'
  Torso $d '#8a2428' '#5a1418' '#1a1a20'
  for ($y = 16; $y -le 20; $y += 2) { Rect 12 ($y-$d) 19 ($y-$d) '#2a2a30' }
  Arms $d '#2a2a30' $SKIN
  Rect 6 (15-$d) 9 (19-$d) '#2a2a30'; Rect 6 (19-$d) 9 (19-$d) '#8a2428'
  Rect 22 (15-$d) 25 (19-$d) '#2a2a30'; Rect 22 (19-$d) 25 (19-$d) '#8a2428'
  Face $d $SKIN
  Rect 12 (11-$d) 19 (12-$d) '#7a2020'
  Rect 11 (4-$d) 20 (7-$d) '#3a3a48'; Rect 10 (7-$d) 21 (8-$d) '#2a2a36'; Rect 15 (1-$d) 16 (3-$d) '#d8b040'
  # katana
  Rect 26 6 26 22 $STEEL; Dot 26 6 '#ffffff'; Rect 25 23 27 23 '#e8c050'; Rect 26 24 26 26 '#3a2a22'
}
function Ninja($f) {
  $d = $f
  Legs $f '#22222e' '#14141c'
  Torso $d '#2a2a3a' '#1a1a26' '#6a1a28'
  Arms $d '#2a2a3a' '#2a2a3a'
  Rect 11 (4-$d) 20 (12-$d) '#22222e'
  Rect 12 (10-$d) 19 (10-$d) $SKIN; Dot 14 (10-$d) '#ff3030'; Dot 17 (10-$d) '#ff3030'
  Rect 11 (13-$d) 20 (14-$d) '#6a1a28'
  if ($f -eq 0) { Rect 21 (13-$d) 24 (14-$d) '#6a1a28'; Rect 24 (15-$d) 25 (17-$d) '#4a1018' }
  else          { Rect 21 (13-$d) 23 (13-$d) '#6a1a28'; Rect 23 (14-$d) 25 (15-$d) '#4a1018' }
  # dagger
  Rect 25 16 25 23 $STEEL; Rect 25 24 25 25 '#5a3a22'
}
function Monk($f) {
  $d = $f
  Torso $d '#c89a30' '#9a7220' '#8a2a24'
  Rect 10 22 21 28 '#c89a30'; Rect 10 22 11 28 '#9a7220'; Rect 20 22 21 28 '#9a7220'; Rect 10 28 21 28 '#8a2a24'
  if ($f -eq 0) { Rect 11 29 14 30 $SHOE; Rect 17 29 20 30 $SHOE } else { Rect 12 29 15 30 $SHOE; Rect 16 29 19 30 $SHOE }
  Arms $d '#e0b850' $SKIN
  Rect 12 (5-$d) 19 (12-$d) $SKIN; Rect 13 (5-$d) 15 (5-$d) '#f0c8a0'
  Dot 14 (10-$d) '#c080ff'; Dot 17 (10-$d) '#c080ff'; Rect 13 (8-$d) 15 (8-$d) '#8a6a40'; Rect 16 (8-$d) 18 (8-$d) '#8a6a40'
  Rect 11 (13-$d) 20 (13-$d) '#5a3a22'; Dot 13 (14-$d) '#5a3a22'; Dot 15 (14-$d) '#5a3a22'; Dot 17 (14-$d) '#5a3a22'
  # floating spirit orb
  $oy = 17 - $f
  Rect 24 $oy 25 ($oy+1) '#c080ff'; Dot 24 $oy '#ffffff'; Dot 23 ($oy-1) '#a060e0'; Dot 26 ($oy+2) '#a060e0'
}
function Brute($f) {
  $d = $f; $g = '#8a9a6a'
  if ($f -eq 0) { Rect 14 36 21 44 '#4a3a30'; Rect 27 36 34 42 '#4a3a30'; Rect 12 44 22 46 $SHOE; Rect 26 42 36 44 $SHOE }
  else          { Rect 14 36 21 42 '#4a3a30'; Rect 27 36 34 44 '#4a3a30'; Rect 12 42 22 44 $SHOE; Rect 26 44 36 46 $SHOE }
  Rect 14 34 34 37 '#4a3a30'
  Rect 10 (18-$d) 37 (34-$d) '#6a6a74'; Rect 10 (18-$d) 12 (34-$d) '#4a4a54'; Rect 35 (18-$d) 37 (34-$d) '#4a4a54'
  Rect 16 (21-$d) 31 (21-$d) '#8a8a96'; Rect 16 (26-$d) 31 (26-$d) '#8a8a96'; Rect 23 (21-$d) 24 (30-$d) '#8a8a96'
  Rect 10 (33-$d) 37 (34-$d) '#3a2a22'; Rect 22 (33-$d) 25 (34-$d) '#c8a050'
  Rect 5 (16-$d) 12 (22-$d) '#8a8a96'; Rect 35 (16-$d) 42 (22-$d) '#8a8a96'
  Rect 6 (14-$d) 6 (15-$d) $STEEL; Rect 10 (14-$d) 10 (15-$d) $STEEL; Rect 37 (14-$d) 37 (15-$d) $STEEL; Rect 41 (14-$d) 41 (15-$d) $STEEL
  Rect 4 (22-$d) 9 (32-$d) $g; Rect 3 (32-$d) 10 (36-$d) '#7a8a5a'
  Rect 38 (22-$d) 43 (32-$d) $g; Rect 37 (32-$d) 44 (36-$d) '#7a8a5a'
  # club
  Rect 40 6 43 34 '#6a4a2a'; Rect 39 3 44 14 '#5a3a22'; Dot 38 7 $STEEL; Dot 45 9 $STEEL; Dot 38 12 $STEEL; Dot 45 13 $STEEL
  # head, horns, tusks
  Rect 17 (6-$d) 30 (17-$d) $g; Rect 17 (6-$d) 18 (17-$d) '#6a7a4a'; Rect 29 (6-$d) 30 (17-$d) '#6a7a4a'
  Rect 19 (9-$d) 28 (9-$d) '#3a4a2a'; Rect 20 (10-$d) 22 (11-$d) '#ff3030'; Rect 25 (10-$d) 27 (11-$d) '#ff3030'
  Rect 20 (15-$d) 27 (16-$d) '#3a2a22'; Rect 20 (13-$d) 21 (16-$d) '#f0ead0'; Rect 26 (13-$d) 27 (16-$d) '#f0ead0'
  Rect 15 (3-$d) 17 (8-$d) '#e8e0c0'; Rect 14 (1-$d) 15 (3-$d) '#e8e0c0'; Rect 30 (3-$d) 32 (8-$d) '#e8e0c0'; Rect 32 (1-$d) 33 (3-$d) '#e8e0c0'
}

function Build($name, $w, $h, $fn) {
  $sheet = New-Object System.Drawing.Bitmap ([int]($w * 2)), $h, $fmt
  foreach ($f in 0, 1) {
    $script:W = $w; $script:H = $h
    $script:cur = New-Object System.Drawing.Bitmap $w, $h, $fmt
    & $fn $f
    for ($y = 0; $y -lt $h; $y++) { for ($x = 0; $x -lt $w; $x++) {
      $px = $script:cur.GetPixel($x, $y)
      if ($px.A -gt 0) { $sheet.SetPixel($f*$w + $x, $y, $px); continue }
      $n = $false
      foreach ($o in @(@(1,0), @(-1,0), @(0,1), @(0,-1))) {
        $nx = $x + $o[0]; $ny = $y + $o[1]
        if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h -and $script:cur.GetPixel($nx, $ny).A -gt 0) { $n = $true }
      }
      if ($n) { $sheet.SetPixel($f*$w + $x, $y, (Col $OL)) }
    } }
  }
  $sheet.Save((Join-Path $root "assets\$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  return $sheet
}

function Shielder($f) {
  $d = $f
  Legs $f '#3a3a48' $SHOE
  Torso $d '#6a7080' '#4a5060' '#2a2a36'
  for ($y = 16; $y -le 20; $y += 2) { Rect 12 ($y-$d) 19 ($y-$d) '#8a90a0' }
  Arms $d '#4a5060' $SKIN
  Face $d $SKIN
  Kasa $d '#6a7a8a' '#4a5a6a'
  # short sword (right)
  Rect 26 13 26 22 $STEEL; Rect 25 23 27 23 '#e8c050'
  # big tower shield (left) with red crest
  Rect 2 (13-$d) 9 (28-$d) '#8a8a9a'; Rect 2 (13-$d) 9 (13-$d) '#b0b0c0'; Rect 2 (13-$d) 2 (28-$d) '#5a5a6a'; Rect 9 (13-$d) 9 (28-$d) '#5a5a6a'; Rect 2 (28-$d) 9 (28-$d) '#5a5a6a'
  Rect 4 (18-$d) 7 (21-$d) '#c8283c'; Dot 5 (19-$d) '#f05050'
}
function Shaman($f) {
  $d = $f
  Torso $d '#5a2a7a' '#3a1a5a' '#c080ff'
  Rect 10 22 21 28 '#5a2a7a'; Rect 10 22 11 28 '#3a1a5a'; Rect 20 22 21 28 '#3a1a5a'; Rect 10 28 21 28 '#c080ff'
  if ($f -eq 0) { Rect 11 29 14 30 $SHOE; Rect 17 29 20 30 $SHOE } else { Rect 12 29 15 30 $SHOE; Rect 16 29 19 30 $SHOE }
  Arms $d '#4a2268' '#b89a80'
  Rect 11 (4-$d) 20 (12-$d) '#3a1a5a'; Rect 12 (8-$d) 19 (12-$d) '#1a0a24'; Dot 14 (10-$d) '#e080ff'; Dot 17 (10-$d) '#e080ff'
  # skull staff with spirit orb
  Rect 26 7 26 29 '#6a4a2a'; Rect 24 3 28 6 '#e8e0d0'; Dot 25 4 $OL; Dot 27 4 $OL
  $oy = 1 + $f; Dot 26 $oy '#e080ff'; Dot 23 (5-$f) '#c080ff'; Dot 29 (4+$f) '#c080ff'
}
function Sniper($f) {
  $d = $f
  Legs $f '#2a2a30' $SHOE
  Torso $d '#3a3a44' '#24242c' '#7a1a1a'
  Arms $d '#2e2e38' $SKIN
  Rect 11 (4-$d) 20 (12-$d) '#2a2a34'; Rect 12 (9-$d) 19 (12-$d) '#1a1a20'; Dot 14 (10-$d) '#ff4040'; Dot 17 (10-$d) '#ff4040'
  Rect 11 (8-$d) 20 (8-$d) '#7a1a1a'
  # long yumi bow (taller than the archer's) + string
  Dot 5 2 '#5a3a22'; Dot 4 3 '#5a3a22'; Rect 3 4 3 26 '#5a3a22'; Dot 4 27 '#5a3a22'; Dot 5 28 '#5a3a22'
  Rect 5 3 5 27 '#d8d8d8'
  Rect 21 10 23 15 '#3a2a1a'; Dot 21 9 '#f66'; Dot 23 9 '#f66'
}
function Assassin($f) {
  $d = $f
  Legs $f '#2a1a2e' '#140a18'
  Torso $d '#3a1a3e' '#22102a' '#c080ff'
  Arms $d '#3a1a3e' '#3a1a3e'
  Rect 11 (4-$d) 20 (12-$d) '#2a1430'
  Rect 12 (10-$d) 19 (10-$d) $SKIN; Dot 14 (10-$d) '#ff40ff'; Dot 17 (10-$d) '#ff40ff'
  Rect 11 (13-$d) 20 (14-$d) '#7a2a8a'
  if ($f -eq 0) { Rect 21 (13-$d) 24 (14-$d) '#7a2a8a'; Rect 24 (15-$d) 25 (18-$d) '#5a1a6a' } else { Rect 21 (13-$d) 23 (13-$d) '#7a2a8a'; Rect 23 (14-$d) 26 (15-$d) '#5a1a6a' }
  # twin daggers
  Rect 5 (17-$d) 5 (22-$d) $STEEL; Rect 5 (23-$d) 5 (24-$d) '#5a3a22'
  Rect 26 (17-$d) 26 (22-$d) $STEEL; Rect 26 (23-$d) 26 (24-$d) '#5a3a22'
}
function Wisp($f) {
  $o = $f
  # flickering flame spirit, centred low in the frame
  Rect 11 17 20 26 '#ff8a30'; Rect 12 14 19 28 '#ff8a30'; Rect 13 12 18 29 '#ff8a30'
  Rect (14+$o) 9 (17+$o) 12 '#ff8a30'; Rect (15+$o) 6 (16+$o) 9 '#ffb050'
  Rect 13 17 18 25 '#ffe080'; Rect 14 15 17 26 '#ffe080'
  Rect 13 19 14 20 $OL; Rect 17 19 18 20 $OL; Rect 15 23 16 23 '#c04010'
  if ($f -eq 0) { Dot 10 22 '#ff6020'; Dot 21 20 '#ff6020'; Dot 12 30 '#ff6020' } else { Dot 10 19 '#ff6020'; Dot 21 23 '#ff6020'; Dot 19 30 '#ff6020' }
}

$sheets = @{}
$sheets.shielder = Build 'e_shielder' 32 32 'Shielder'
$sheets.shaman   = Build 'e_shaman'   32 32 'Shaman'
$sheets.sniper   = Build 'e_sniper'   32 32 'Sniper'
$sheets.assassin = Build 'e_assassin' 32 32 'Assassin'
$sheets.wisp     = Build 'e_wisp'     32 32 'Wisp'
$pv2 = New-Object System.Drawing.Bitmap (320*4), (32*4), $fmt
$g2 = [System.Drawing.Graphics]::FromImage($pv2); $g2.Clear((Col '#3e4b2e'))
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor; $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$i = 0; foreach ($k in 'shielder','shaman','sniper','assassin','wisp') { $sh = $sheets[$k]; $g2.DrawImage($sh, (New-Object System.Drawing.Rectangle ($i*64*4), 0, (64*4), (32*4)), (New-Object System.Drawing.Rectangle 0, 0, 64, 32), [System.Drawing.GraphicsUnit]::Pixel); $i++ }
$pv2.Save((Join-Path $root 'minions2-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$sheets.ashigaru = Build 'e_ashigaru' 32 32 'Ashigaru'
$sheets.archer   = Build 'e_archer'   32 32 'Archer'
$sheets.samurai  = Build 'e_samurai'  32 32 'Samurai'
$sheets.ninja    = Build 'e_ninja'    32 32 'Ninja'
$sheets.monk     = Build 'e_monk'     32 32 'Monk'
$sheets.brute    = Build 'e_brute'    48 48 'Brute'

# preview (4x, nearest neighbour)
$S = 4
$pv = New-Object System.Drawing.Bitmap (128*$S), (144*$S), $fmt
$g = [System.Drawing.Graphics]::FromImage($pv)
$g.Clear((Col '#3e4b2e'))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
function Put($sh, $x, $y) { $g.DrawImage($sh, (New-Object System.Drawing.Rectangle ($x*$S), ($y*$S), ($sh.Width*$S), ($sh.Height*$S)), (New-Object System.Drawing.Rectangle 0, 0, $sh.Width, $sh.Height), [System.Drawing.GraphicsUnit]::Pixel) }
Put $sheets.ashigaru 0 0; Put $sheets.archer 64 0; Put $sheets.samurai 0 32; Put $sheets.ninja 64 32; Put $sheets.monk 0 64; Put $sheets.brute 0 96
$pv.Save((Join-Path $root 'minions-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
'done'
