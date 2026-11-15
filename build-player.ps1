Add-Type -AssemblyName System.Drawing
$src = [Drawing.Bitmap]::FromFile((Resolve-Path 'art-source\green-knight-source.png'))
$sheet = New-Object Drawing.Bitmap 64,32,([Drawing.Imaging.PixelFormat]::Format32bppArgb)
$colors = @(
  '#0b0b0b','#28321d','#45552c','#697b42','#89985b',
  '#376a26','#4f9929','#77c532','#b5e87b',
  '#b87954','#eeb48b','#f0bd46','#f5f0d5',
  '#5a575b','#b3b1b6'
)
$palette = @($colors | ForEach-Object { [Drawing.ColorTranslator]::FromHtml($_) })
for ($frame=0; $frame -lt 2; $frame++) {
  $start = [int]($frame * $src.Width / 2)
  $end = [int](($frame + 1) * $src.Width / 2)
  $minX=$end; $maxX=$start; $minY=$src.Height; $maxY=0
  for ($y=0; $y -lt $src.Height; $y+=2) {
    for ($x=$start; $x -lt $end; $x+=2) {
      if ($src.GetPixel($x,$y).A -ge 128) {
        if ($x -lt $minX) {$minX=$x}; if ($x -gt $maxX) {$maxX=$x}
        if ($y -lt $minY) {$minY=$y}; if ($y -gt $maxY) {$maxY=$y}
      }
    }
  }
  $w=$maxX-$minX+1; $h=$maxY-$minY+1
  $destH=30
  $destW=[int][Math]::Round($w * $destH / $h)
  if ($destW -gt 30) {$destW=30}
  $left=$frame*32+[int][Math]::Floor((32-$destW)/2)
  for ($dy=0; $dy -lt $destH; $dy++) {
    for ($dx=0; $dx -lt $destW; $dx++) {
      $sx=[int][Math]::Floor($minX+($dx+0.5)*$w/$destW)
      $sy=[int][Math]::Floor($minY+($dy+0.5)*$h/$destH)
      $p=$src.GetPixel($sx,$sy)
      if ($p.A -lt 128) {continue}
      $best=0; $distance=[double]::PositiveInfinity
      for ($i=0; $i -lt $palette.Count; $i++) {
        $c=$palette[$i]
        $d=($p.R-$c.R)*($p.R-$c.R)+($p.G-$c.G)*($p.G-$c.G)+($p.B-$c.B)*($p.B-$c.B)
        if ($d -lt $distance) {$distance=$d; $best=$i}
      }
      $sheet.SetPixel($left+$dx,1+$dy,$palette[$best])
    }
  }
  Write-Output "Frame ${frame}: source $w x $h, output $destW x $destH"
}
# Keep the two eyes readable after reducing the source to 32 pixels.
for ($frame=0; $frame -lt 2; $frame++) {
  $sheet.SetPixel($frame*32+13,12,$palette[0])
  $sheet.SetPixel($frame*32+18,12,$palette[0])
}
$sheet.Save('assets\player.png',[Drawing.Imaging.ImageFormat]::Png)
$preview = New-Object Drawing.Bitmap 512,256,([Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g=[Drawing.Graphics]::FromImage($preview)
$g.Clear([Drawing.ColorTranslator]::FromHtml('#f2f0eb'))
$g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode=[Drawing.Drawing2D.PixelOffsetMode]::Half
$g.DrawImage($sheet,(New-Object Drawing.Rectangle 0,0,512,256),(New-Object Drawing.Rectangle 0,0,64,32),[Drawing.GraphicsUnit]::Pixel)
$g.Dispose(); $preview.Save('player-preview.png',[Drawing.Imaging.ImageFormat]::Png)
$preview.Dispose(); $sheet.Dispose(); $src.Dispose()
