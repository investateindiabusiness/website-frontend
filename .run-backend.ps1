$env:PORT='5001'
$env:CORS_ORIGIN='http://localhost:3000'
$svc=Join-Path 'C:\Users\visha\Desktop\investate-chatbot\backend' 'service-account.prod.json'
if (Test-Path $svc) { $env:FIREBASE_SERVICE_ACCOUNT=Get-Content -Raw $svc }
$frontendEnv=Join-Path 'C:\Users\visha\Desktop\investate-chatbot\frontend' '.env.local'
if (Test-Path $frontendEnv) { Get-Content $frontendEnv | ForEach-Object { if ($_ -match '^NEXT_PUBLIC_FIREBASE_API_KEY=(.*)$') { $env:FIREBASE_API_KEY=$matches[1] } } }
$chatEnv=Join-Path 'C:\Users\visha\Desktop\investate-chatbot\chatbot-prototype' '.env'
if (Test-Path $chatEnv) { Get-Content $chatEnv | ForEach-Object { if ($_ -match '^GROQ_API_KEY=(.*)$') { $env:GROQ_API_KEY=$matches[1] } } }
Set-Location 'C:\Users\visha\Desktop\investate-chatbot\backend'
npm.cmd run dev
