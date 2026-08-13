$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Server running at http://localhost:8080/'
Write-Host 'Press Ctrl+C to stop'

while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.LocalPath
    
    if ($path -eq '/') { $path = '/index.html' }
    
    $basePath = 'c:\Users\USER\Desktop\project 2 opus'
    $filePath = Join-Path $basePath ($path -replace '/', '\')
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        
        $contentType = switch($ext) {
            '.html'  { 'text/html; charset=utf-8' }
            '.css'   { 'text/css; charset=utf-8' }
            '.js'    { 'application/javascript; charset=utf-8' }
            '.png'   { 'image/png' }
            '.jpg'   { 'image/jpeg' }
            '.jpeg'  { 'image/jpeg' }
            '.svg'   { 'image/svg+xml' }
            '.ico'   { 'image/x-icon' }
            '.webp'  { 'image/webp' }
            '.pdf'   { 'application/pdf' }
            default  { 'application/octet-stream' }
        }
        
        $response.ContentType = $contentType
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    
    $response.Close()
    Write-Host "$($request.HttpMethod) $($request.Url.LocalPath) - $($response.StatusCode)"
}
