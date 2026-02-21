$path = 'c:\Users\kohata\Desktop\MyGames\games\tower\index.html'
$content = Get-Content -Path $path -Encoding utf8
$newContent = $content[0..113] + '    <script src="script.js"></script>' + $content[1531..($content.Length-1)]
$newContent | Out-File -FilePath $path -Encoding utf8
