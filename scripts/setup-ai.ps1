Write-Host "HealthSync AI setup" -ForegroundColor Green
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "Ollama is not installed. Install it from https://ollama.com/download" -ForegroundColor Yellow
  exit 1
}
Write-Host "Pulling the default local model: llama3.2:3b" -ForegroundColor Cyan
ollama pull llama3.2:3b
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$backendEnvironment = Join-Path $repositoryRoot "backend\.env"
if (Test-Path -LiteralPath $backendEnvironment) {
  Write-Host "AI model ready. The existing private backend environment file was left unchanged." -ForegroundColor Green
} else {
  Write-Host "AI model ready. Create backend\.env from backend\.env.example before starting the backend." -ForegroundColor Green
}
