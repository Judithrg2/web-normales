# SUBIR A GITHUB - ejecutar con doble clic
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$gh = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host ""
Write-Host "=== SUBIR WEBS A GITHUB ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $gh) {
  $auth = & $gh auth status 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Paso 1: Inicia sesion en GitHub..." -ForegroundColor Yellow
    & $gh auth login --hostname github.com --git-protocol https --web
    & $gh auth setup-git
  } else {
    Write-Host "Sesion GitHub: OK" -ForegroundColor Green
  }
}

Write-Host "Paso 2: Subiendo archivos..." -ForegroundColor Yellow
git add index.html .nojekyll README.md .gitignore webs/
git commit -m "Anadir indice y pagina principal" 2>$null
git push origin main

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "ERROR: no se pudo subir." -ForegroundColor Red
  Write-Host "Vuelve a ejecutar este archivo." -ForegroundColor Red
  Read-Host "Pulsa Enter para cerrar"
  exit 1
}

Write-Host ""
Write-Host "LISTO! Abre en el navegador:" -ForegroundColor Green
Write-Host "  https://judithrg2.github.io/web-normales/" -ForegroundColor White
Write-Host ""
Start-Process "https://judithrg2.github.io/web-normales/"
Read-Host "Pulsa Enter para cerrar"
