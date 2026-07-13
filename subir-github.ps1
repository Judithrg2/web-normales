# SUBIR CAMBIOS A GITHUB
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$gh = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host ""
Write-Host "=== SUBIR WEBS A GITHUB ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $gh) {
  & $gh auth status 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Inicia sesion en GitHub..." -ForegroundColor Yellow
    & $gh auth login --hostname github.com --git-protocol https --web
    & $gh auth setup-git
  }
}

Write-Host "Subiendo..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR al subir. Ejecuta de nuevo." -ForegroundColor Red
  Read-Host "Pulsa Enter"
  exit 1
}

Write-Host ""
Write-Host "LISTO!" -ForegroundColor Green
Write-Host "  https://judithrg2.github.io/web-normales/"
Write-Host "  https://judithrg2.github.io/web-normales/webs/clinica-estetica/plantilla-1/"
Write-Host "  https://judithrg2.github.io/web-normales/webs/psicologos/plantilla-1/"
Write-Host ""
Start-Process "https://judithrg2.github.io/web-normales/"
Read-Host "Pulsa Enter"
