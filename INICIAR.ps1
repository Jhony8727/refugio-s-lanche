# Script de Inicialização - Refugio's Lanche
# Execute este arquivo para iniciar o sistema completo

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🍔 REFUGIO'S LANCHE - INICIALIZANDO..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Parar processos Node existentes
Write-Host "🔄 Parando processos anteriores..." -ForegroundColor Gray
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep -Seconds 2

# Diretórios
$backend = "c:\Users\Jhony\Desktop\Refugio´s Lanche\backend"
$frontend = "c:\Users\Jhony\Desktop\Refugio´s Lanche\frontend"

# Iniciar Backend
Write-Host "🟢 Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backend'; Write-Host '🍔 BACKEND - Refugio''s Lanche' -ForegroundColor Cyan; npm start"
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontend'; Write-Host '🎨 FRONTEND - Refugio''s Lanche' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 5

# Verificar se estão rodando
Write-Host "`n✅ Verificando servidores..." -ForegroundColor Yellow
$backend_running = netstat -ano | findstr "LISTENING" | findstr ":5000"
$frontend_running = netstat -ano | findstr "LISTENING" | findstr ":5173"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "📊 STATUS DOS SERVIDORES" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

if ($backend_running) {
    Write-Host "✅ Backend:  RODANDO (porta 5000)" -ForegroundColor Green
} else {
    Write-Host "❌ Backend:  ERRO" -ForegroundColor Red
}

if ($frontend_running) {
    Write-Host "✅ Frontend: RODANDO (porta 5173)" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: ERRO" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🌐 ACESSE O SITE:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

# Abrir navegador
Start-Sleep -Seconds 2
Write-Host "`n🌐 Abrindo navegador..." -ForegroundColor Magenta
Start-Process "http://localhost:5173"

Write-Host "`n✅ Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host "🔐 Admin: admin@refugio.com.br / admin123456`n" -ForegroundColor Yellow
