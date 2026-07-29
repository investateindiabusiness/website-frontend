# Write progress messages
Write-Host "1. Initializing local Git repository..." -ForegroundColor Cyan
git init

Write-Host "2. Renaming branch to 'main'..." -ForegroundColor Cyan
git checkout -b main

Write-Host "3. Staging all files..." -ForegroundColor Cyan
git add .

Write-Host "4. Committing files..." -ForegroundColor Cyan
git commit -m "Initial commit of investateindia_frontend"

Write-Host "5. Configuring remote origin..." -ForegroundColor Cyan
# Remove existing origin if any
git remote remove origin 2>$null
git remote add origin https://git.brvteck.com/investateindia_frontend.git

# Set sslVerify false in case self-signed/internal certificates are used
git config http.sslVerify false

Write-Host "6. Pushing to git.brvteck.com..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Git setup and push completed!" -ForegroundColor Green
