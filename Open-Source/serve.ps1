param([int]$Port = 8000)

$Root = Get-Location
$Listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$Listener.Prefixes.Add($prefix)

try {
    $Listener.Start()
    Write-Host "Serving $Root at $prefix (Ctrl-C to stop)"

    while ($Listener.IsListening) {
        $context = $Listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/' -or [string]::IsNullOrWhiteSpace($localPath)) { $localPath = '/index.html' }
        $rel = $localPath.TrimStart('/')
        $filePath = Join-Path -Path $Root -ChildPath $rel

        if (Test-Path $filePath) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            switch ($ext) {
                '.html' { $ct = 'text/html' }
                '.css' { $ct = 'text/css' }
                '.js' { $ct = 'application/javascript' }
                '.json' { $ct = 'application/json' }
                '.png' { $ct = 'image/png' }
                '.jpg' { $ct = 'image/jpeg' }
                '.jpeg' { $ct = 'image/jpeg' }
                '.gif' { $ct = 'image/gif' }
                '.svg' { $ct = 'image/svg+xml' }
                '.ico' { $ct = 'image/x-icon' }
                '.txt' { $ct = 'text/plain' }
                default { $ct = 'application/octet-stream' }
            }

            $response.ContentType = $ct
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
            $msg = "404 Not Found: $($request.Url.AbsolutePath)"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.ContentType = 'text/plain'
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }

        $response.OutputStream.Close()
        $context.Response.Close()
    }
}
catch {
    Write-Host "Server stopped: $_"
}
finally {
    if ($Listener -and $Listener.IsListening) { $Listener.Stop() }
    $Listener.Close()
}
