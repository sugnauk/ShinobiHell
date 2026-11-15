# Generates assets/boss_01.png ... boss_10.png (128x64 = 2 frames of 64x64) + bosses-preview.png
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$OL = '#14101a'; $SKIN = '#e0b080'; $STEEL = '#d8dce8'; $GOLD = '#e8c050'
$script:cur = $null; $script:W = 64; $script:H = 64
function Col($h) { [System.Drawing.ColorTranslator]::FromHtml($h) }
function Dot($x, $y, $c) { if ($x -ge 0 -and $x -lt $script:W -and $y -ge 0 -and $y -lt $script:H) { $script:cur.SetPixel($x, $y, (Col $c)) } }
function Rect($x1, $y1, $x2, $y2, $c) { for ($y = $y1; $y -le $y2; $y++) { for ($x = $x1; $x -le $x2; $x++) { Dot $x $y $c } } }

# shared 64px body. $o: cloth dark arm hand skin pant shoe belt bulk robe
function Body($f, $o) {
  $d = $f
  if ($o.robe) {
    Rect 18 44 45 59 $o.cloth; Rect 18 44 21 59 $o.dark; Rect 42 44 45 59 $o.dark; Rect 18 58 45 59 $o.belt
    if ($f -eq 0) { Rect 22 60 29 61 $o.shoe; Rect 35 60 42 61 $o.shoe } else { Rect 24 60 31 61 $o.shoe; Rect 33 60 40 61 $o.shoe }
  } elseif ($o.bulk) {
    if ($f -eq 0) { Rect 18 46 28 59 $o.pant; Rect 36 46 46 56 $o.pant; Rect 16 59 29 61 $o.shoe; Rect 35 56 48 58 $o.shoe }
    else          { Rect 18 46 28 56 $o.pant; Rect 36 46 46 59 $o.pant; Rect 16 56 29 58 $o.shoe; Rect 35 59 48 61 $o.shoe }
    Rect 18 44 46 49 $o.pant
  } else {
    if ($f -eq 0) { Rect 22 46 29 59 $o.pant; Rect 35 46 42 56 $o.pant; Rect 20 59 30 61 $o.shoe; Rect 34 56 44 58 $o.shoe }
    else          { Rect 22 46 29 56 $o.pant; Rect 35 46 42 59 $o.pant; Rect 20 56 30 58 $o.shoe; Rect 34 59 44 61 $o.shoe }
    Rect 22 44 42 48 $o.pant
  }
  if ($o.bulk) {
    Rect 12 (22-$d) 51 (45-$d) $o.cloth; Rect 12 (22-$d) 16 (45-$d) $o.dark; Rect 47 (22-$d) 51 (45-$d) $o.dark
    Rect 4 (24-$d) 12 (46-$d) $o.arm; Rect 51 (24-$d) 59 (46-$d) $o.arm
    Rect 3 (46-$d) 13 (52-$d) $o.hand; Rect 50 (46-$d) 60 (52-$d) $o.hand
    Rect 22 (8-$d) 41 (24-$d) $o.skin
  } else {
    Rect 18 (26-$d) 45 (43-$d) $o.cloth; Rect 18 (26-$d) 21 (43-$d) $o.dark; Rect 42 (26-$d) 45 (43-$d) $o.dark
    Rect 18 (42-$d) 45 (44-$d) $o.belt
    Rect 13 (28-$d) 18 (44-$d) $o.arm; Rect 45 (28-$d) 50 (44-$d) $o.arm
    Rect 13 (44-$d) 18 (47-$d) $o.hand; Rect 45 (44-$d) 50 (47-$d) $o.hand
    Rect 24 (10-$d) 39 (24-$d) $o.skin
  }
}
function Eyes($d, $y, $col, $bulk) { if ($bulk) { Rect 27 ($y-$d) 29 ($y+1-$d) $col; Rect 34 ($y-$d) 36 ($y+1-$d) $col } else { Rect 28 ($y-$d) 29 ($y+1-$d) $col; Rect 34 ($y-$d) 35 ($y+1-$d) $col } }

function Gyoubu($f) { $d = $f
  Body $f @{cloth='#8a2a24';dark='#5a1a18';arm='#5a1a18';hand=$SKIN;skin=$SKIN;pant='#3a1a18';shoe='#1a1010';belt='#d0a040'}
  for ($y = 28; $y -le 40; $y += 3) { Rect 22 ($y-$d) 41 ($y-$d) '#b03a30' }
  Rect 11 (24-$d) 20 (31-$d) '#3a1a18'; Rect 43 (24-$d) 52 (31-$d) '#3a1a18'; Rect 11 (24-$d) 20 (25-$d) $GOLD; Rect 43 (24-$d) 52 (25-$d) $GOLD
  Eyes $d 16 $OL $false
  Rect 24 (18-$d) 39 (24-$d) '#a02020'; Rect 27 (21-$d) 36 (21-$d) '#f0e0c0'
  Rect 22 (5-$d) 41 (12-$d) '#2a1a18'; Rect 20 (12-$d) 43 (14-$d) '#3a2a28'
  Rect 19 (1-$d) 21 (7-$d) $GOLD; Rect 42 (1-$d) 44 (7-$d) $GOLD; Rect 21 (6-$d) 23 (8-$d) $GOLD; Rect 40 (6-$d) 42 (8-$d) $GOLD; Rect 30 (5-$d) 33 (9-$d) $GOLD
  Rect 54 3 55 61 '#6a4a2a'; Rect 53 0 56 6 $STEEL; Dot 54 0 '#ffffff'; Rect 52 8 57 9 '#c8283c'
}
function Ogre($f) { $d = $f; $sk = '#a89888'
  Body $f @{cloth=$sk;dark='#7a6a5a';arm=$sk;hand='#988878';skin=$sk;pant='#4a3a2a';shoe='#3a2a1a';bulk=$true}
  Rect 18 44 46 53 '#4a3a2a'; Rect 18 44 46 45 '#6a5a3a'
  Rect 20 (6-$d) 43 (9-$d) $sk; Rect 25 (12-$d) 38 (13-$d) '#5a4a3a'
  Eyes $d 15 '#ff3030' $true
  Rect 27 (20-$d) 36 (21-$d) '#3a2a1a'; Dot 28 (19-$d) '#f0ead0'; Dot 35 (19-$d) '#f0ead0'
  for ($i = 0; $i -le 15; $i++) { $c = if ($i % 2) { '#7a7a88' } else { '#a0a0b0' }; Rect (14+$i*2) (24+$i-$d) (15+$i*2) (25+$i-$d) $c }
  Rect 3 (40-$d) 13 (43-$d) '#5a5a6a'; Rect 50 (40-$d) 60 (43-$d) '#5a5a6a'
  for ($y = 52; $y -le 61; $y += 2) { Dot (7+($y%4)/2) ($y-$d) '#8a8a98'; Dot (56-($y%4)/2) ($y-$d) '#8a8a98' }
}
function Genichiro($f) { $d = $f
  Body $f @{cloth='#2a4a8a';dark='#1a2a5a';arm='#2a4a8a';hand=$SKIN;skin=$SKIN;pant='#1a1a2a';shoe='#101018';belt='#e8e8f0'}
  Rect 27 (26-$d) 36 (28-$d) '#e8e8f0'; Rect 29 (29-$d) 34 (31-$d) '#e8e8f0'; Rect 31 (32-$d) 32 (33-$d) '#e8e8f0'
  Rect 18 (26-$d) 21 (43-$d) '#e8e8f0'; Rect 42 (26-$d) 45 (43-$d) '#e8e8f0'
  Eyes $d 16 $OL $false; Rect 27 (20-$d) 36 (23-$d) '#8a6a50'
  Rect 23 (6-$d) 40 (11-$d) '#1a1a22'; Rect 23 (11-$d) 24 (16-$d) '#1a1a22'; Rect 39 (11-$d) 40 (16-$d) '#1a1a22'
  Rect 29 (1-$d) 34 (6-$d) '#1a1a22'; Rect 29 (4-$d) 34 (4-$d) '#c8283c'
  Dot 8 3 '#5a3a22'; Dot 7 4 '#5a3a22'; Rect 6 5 6 58 '#5a3a22'; Dot 7 59 '#5a3a22'; Dot 8 60 '#5a3a22'; Rect 9 4 9 59 '#e0e0e0'
  $sy = 40 + 2*$f; Dot 51 $sy '#ffff80'; Dot 53 ($sy-2) '#ffff80'; Dot 52 ($sy+3) '#ffffff'; Dot 55 ($sy+1) '#ffff80'
}
function Butterfly($f) { $d = $f; $wl = 2*$f
  Rect 2 (12+$wl) 16 (30) '#a060c0'; Rect 4 (30) 15 (42-$wl) '#8040a0'; Rect 6 (17+$wl) 10 (21+$wl) '#f0a0e0'; Rect 7 (33) 10 (36) '#f0a0e0'
  Rect 47 (12+$wl) 61 (30) '#a060c0'; Rect 48 (30) 59 (42-$wl) '#8040a0'; Rect 53 (17+$wl) 57 (21+$wl) '#f0a0e0'; Rect 53 (33) 56 (36) '#f0a0e0'
  Body $f @{cloth='#6a2a8a';dark='#3a1a5a';arm='#6a2a8a';hand='#e8c8a8';skin='#e8c8a8';pant='#3a1a5a';shoe='#1a0a20';belt='#f0a0e0';robe=$true}
  Rect 18 (34-$d) 45 (36-$d) '#f0a0e0'; Rect 30 (26-$d) 33 (43-$d) '#3a1a5a'
  Eyes $d 16 '#5a2a7a' $false; Dot 31 (21-$d) '#c04060'; Dot 32 (21-$d) '#c04060'
  Rect 22 (6-$d) 41 (12-$d) '#1a1020'; Rect 21 (10-$d) 24 (32-$d) '#1a1020'; Rect 39 (10-$d) 42 (32-$d) '#1a1020'
  Rect 36 (5-$d) 38 (7-$d) $GOLD; Dot 37 (4-$d) '#f0a0e0'
  Rect 12 (40-$d) 12 (46-$d) $STEEL; Rect 51 (40-$d) 51 (46-$d) $STEEL
}
function Ape($f) { $d = $f; $fur = '#7a7a80'
  Rect 16 (6-$d) 47 (26-$d) $fur
  Body $f @{cloth=$fur;dark='#4a4a52';arm=$fur;hand='#9a8a7a';skin='#9a8a7a';pant='#5a5a62';shoe='#3a3a40';bulk=$true}
  Rect 4 (46-$d) 12 (54-$d) $fur; Rect 51 (46-$d) 59 (54-$d) $fur; Rect 3 (54-$d) 13 (57-$d) '#9a8a7a'; Rect 50 (54-$d) 60 (57-$d) '#9a8a7a'
  Rect 18 (4-$d) 45 (9-$d) $fur; Rect 22 (2-$d) 26 (4-$d) $fur; Rect 37 (2-$d) 41 (4-$d) $fur
  Rect 26 (16-$d) 37 (23-$d) '#c8b8a0'; Dot 30 (18-$d) $OL; Dot 33 (18-$d) $OL; Rect 28 (21-$d) 35 (22-$d) '#3a2a2a'
  Eyes $d 13 '#c06020' $true
  for ($y = 26; $y -le 42; $y += 4) { Rect 20 ($y-$d) 43 ($y-$d) '#6a6a72' }
  Rect 58 4 60 44 $STEEL; Rect 57 44 61 46 '#5a3a22'
}
function Monk($f) { $d = $f
  Body $f @{cloth='#e8e0c0';dark='#b89a40';arm='#e8e0c0';hand='#c8b090';skin='#e8e0c0';pant='#b89a40';shoe='#5a4a30';belt='#d8b040';robe=$true}
  Rect 18 (36-$d) 45 (38-$d) '#d8b040'
  Rect 22 (6-$d) 41 (24-$d) '#e8e0c0'; Rect 26 (12-$d) 37 (22-$d) '#2a2030'; Eyes $d 16 '#e8e0ff' $false
  Rect 20 (24-$d) 43 (25-$d) '#5a3a22'; for ($x = 21; $x -le 42; $x += 3) { Rect $x (26-$d) ($x+1) (27-$d) '#5a3a22' }
  Rect 22 (4-$d) 41 (6-$d) '#f0e8d0'; Rect 20 (6-$d) 21 (26-$d) '#f0e8d0'; Rect 42 (6-$d) 43 (26-$d) '#f0e8d0'
  Rect 54 6 55 61 '#8a6a3a'; Rect 53 0 56 7 $STEEL; Rect 56 2 57 5 $STEEL; Dot 54 0 '#ffffff'
  $gy = 10 - $f; Dot 31 $gy '#e8e0ff'; Dot 18 (14+$f) '#c8c0ff'; Dot 45 (12-$f) '#c8c0ff'
}
function Armored($f) { $d = $f
  Body $f @{cloth='#5a6068';dark='#383c44';arm='#4a5058';hand='#383c44';skin='#5a6068';pant='#383c44';shoe='#1a1c20';belt='#b0b8c0'}
  for ($y = 28; $y -le 40; $y += 4) { Rect 20 ($y-$d) 43 ($y-$d) '#7a8088' }
  Rect 9 (22-$d) 21 (32-$d) '#6a7078'; Rect 42 (22-$d) 54 (32-$d) '#6a7078'; Rect 9 (22-$d) 21 (23-$d) '#b0b8c0'; Rect 42 (22-$d) 54 (23-$d) '#b0b8c0'
  Rect 22 (5-$d) 41 (24-$d) '#5a6068'; Rect 22 (5-$d) 41 (6-$d) '#8a9098'; Rect 25 (14-$d) 38 (15-$d) $OL; Dot 29 (14-$d) '#ff4040'; Dot 34 (14-$d) '#ff4040'
  for ($x = 26; $x -le 37; $x += 2) { Rect $x (18-$d) $x (22-$d) '#383c44' }
  Rect 30 (0) 33 (5-$d) '#c8283c'
  Rect 53 0 57 50 $STEEL; Rect 53 0 53 50 '#a8acb8'; Rect 49 51 61 53 $GOLD; Rect 54 54 56 61 '#3a2a1a'
}
function Owl($f) { $d = $f; $sc = '#d8d0b0'
  Body $f @{cloth='#1a3a2a';dark='#0e2418';arm='#1a3a2a';hand='#1a3a2a';skin='#1a3a2a';pant='#0e2418';shoe='#08140c';belt='#80d080'}
  Rect 22 (6-$d) 41 (24-$d) '#1a3a2a'; Rect 22 (2-$d) 25 (6-$d) '#1a3a2a'; Rect 38 (2-$d) 41 (6-$d) '#1a3a2a'
  Rect 25 (14-$d) 38 (17-$d) $SKIN; Rect 27 (14-$d) 29 (16-$d) '#ffd040'; Rect 34 (14-$d) 36 (16-$d) '#ffd040'; Dot 28 (15-$d) $OL; Dot 35 (15-$d) $OL
  Rect 18 (22-$d) 45 (26-$d) $sc
  if ($f -eq 0) { Rect 44 (24-$d) 52 (27-$d) $sc; Rect 50 (28-$d) 54 (36-$d) $sc } else { Rect 44 (24-$d) 54 (26-$d) $sc; Rect 52 (27-$d) 57 (33-$d) $sc }
  for ($i = 0; $i -le 22; $i++) { Dot (6+[int]($i*0.55)) (22+$i) $STEEL }; Rect 18 (44-$d) 20 (46-$d) '#5a3a22'
}
function Demon($f) { $d = $f
  Body $f @{cloth='#4a0e10';dark='#2a0608';arm='#3a0a0c';hand='#2a0608';skin='#a03030';pant='#2a0608';shoe='#140304';bulk=$true}
  Rect 51 (24-$d) 59 (46-$d) '#ff5020'; Rect 50 (46-$d) 60 (52-$d) '#ffb040'; Rect 53 (26-$d) 56 (44-$d) '#ffe080'
  Rect 16 (2-$d) 20 (10-$d) '#e8e0c0'; Rect 13 (0) 16 (4-$d) '#e8e0c0'; Rect 43 (2-$d) 47 (10-$d) '#e8e0c0'; Rect 47 (0) 50 (4-$d) '#e8e0c0'
  Eyes $d 14 '#ffe040' $true; Rect 26 (12-$d) 37 (12-$d) '#5a1010'
  Rect 26 (19-$d) 37 (22-$d) '#2a0608'; Dot 27 (19-$d) '#f0ead0'; Dot 36 (19-$d) '#f0ead0'; Dot 28 (22-$d) '#f0ead0'; Dot 35 (22-$d) '#f0ead0'
  for ($y = 26; $y -le 42; $y += 4) { Rect 18 ($y-$d) 45 ($y-$d) '#6a1418' }
  $fy = 20 - 2*$f; Dot 14 $fy '#ffb040'; Dot 16 ($fy-3) '#ff5020'; Dot 48 ($fy+1) '#ffb040'; Dot 50 ($fy-2) '#ff5020'; Dot 55 (20+$f) '#ffe080'; Dot 57 (17-$f) '#ffb040'
}
function Isshin($f) { $d = $f
  Body $f @{cloth='#e8e8f0';dark='#8a8a98';arm='#e8e8f0';hand=$SKIN;skin=$SKIN;pant='#3a3a48';shoe='#1a1a22';belt='#d0a030'}
  Rect 14 (24-$d) 49 (36-$d) '#c8a860'; for ($x = 15; $x -le 48; $x += 3) { Rect $x (26-$d) $x (36-$d) '#8a6a38' }; Rect 14 (36-$d) 49 (37-$d) '#8a6a38'
  Eyes $d 16 $OL $false
  Rect 22 (5-$d) 41 (12-$d) '#f0f0f8'; Rect 21 (8-$d) 23 (18-$d) '#f0f0f8'; Rect 40 (8-$d) 42 (18-$d) '#f0f0f8'
  Rect 26 (19-$d) 37 (26-$d) '#f0f0f8'; Rect 28 (20-$d) 35 (20-$d) '#c8c8d0'
  Rect 54 6 54 46 $STEEL; Dot 54 6 '#ffffff'; Rect 52 46 56 47 $GOLD; Rect 54 48 54 52 '#3a2a1a'
  Rect 9 0 10 61 '#6a4a2a'; Rect 6 1 13 2 $STEEL; Rect 9 0 10 0 '#ffffff'
}

function Build($name, $fn) {
  $w = 64; $h = 64
  $sheet = New-Object System.Drawing.Bitmap 128, 64, $fmt
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

$list = 'Gyoubu','Ogre','Genichiro','Butterfly','Ape','Monk','Armored','Owl','Demon','Isshin'
$pv = New-Object System.Drawing.Bitmap (5*64*3), (2*64*3), $fmt
$g = [System.Drawing.Graphics]::FromImage($pv); $g.Clear((Col '#3e4b2e'))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor; $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
for ($i = 0; $i -lt 10; $i++) {
  $sh = Build ('boss_' + ($i+1).ToString('00')) $list[$i]
  $g.DrawImage($sh, (New-Object System.Drawing.Rectangle (($i%5)*64*3), ([math]::Floor($i/5)*64*3), (64*3), (64*3)), (New-Object System.Drawing.Rectangle 0, 0, 64, 64), [System.Drawing.GraphicsUnit]::Pixel)
}
$pv.Save((Join-Path $root 'bosses-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
'done'
