
# Simple PowerShell HTTP Server
# Run this script to view your app on your phone (must be on same Wi-Fi)

$Path = "g:\hkks expenscee"
$Port = 8080

# Dynamically get IP in case it changes
$IP = (Test-Connection -ComputerName (hostname) -Count 1).IPv4Address.IPAddressToString

Add-Type -AssemblyName System.Web
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$($Port)/")

try {
    $listener.Start()
    Write-Host "---------------------------------------------------" -ForegroundColor Green
    Write-Host "Server started!" -ForegroundColor Green
    Write-Host "On your phone, open this link:" -ForegroundColor Cyan
    Write-Host "http://$($IP):$Port" -ForegroundColor Yellow
    Write-Host "---------------------------------------------------"
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Red

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        $localPath = Join-Path $Path $urlPath
        
        # Default to index.html
        if ((Test-Path $localPath -PathType Container) -or ($request.Url.LocalPath -eq "/")) {
            $localPath = Join-Path $localPath "index.html"
        }

        if (Test-Path $localPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $content.Length
            
            # Simple MIME type mapping
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
            }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    $listener.Stop()
}
