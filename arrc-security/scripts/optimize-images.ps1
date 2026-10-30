$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public/assets/images'))
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
Get-ChildItem -LiteralPath $assetDirectory -Filter '*.jpg' | Where-Object { $_.BaseName -notmatch '-(640|960)$' } | ForEach-Object {
    $originalFile = $_
    $originalImage = [System.Drawing.Image]::FromFile($originalFile.FullName)
    try {
        foreach ($targetWidth in @(640, 960)) {
            $targetHeight = [Math]::Max(1, [int][Math]::Round($originalImage.Height * $targetWidth / $originalImage.Width))
            $resizedImage = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
            $drawing = [System.Drawing.Graphics]::FromImage($resizedImage)
            try {
                $drawing.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $drawing.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $drawing.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $drawing.DrawImage($originalImage, 0, 0, $targetWidth, $targetHeight)
                $destination = Join-Path $assetDirectory ($originalFile.BaseName + '-' + $targetWidth + '.jpg')
                $resizedImage.Save($destination, $jpegEncoder, $encoderParameters)
            } finally { $drawing.Dispose(); $resizedImage.Dispose() }
        }
        Write-Output ('Optimized variants: ' + $originalFile.Name)
    } finally { $originalImage.Dispose() }
}
$encoderParameters.Dispose()
