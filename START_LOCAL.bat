@echo off
REM Script para iniciar o projeto localmente em Windows

echo.
echo ========================================
echo 🏛️  MUSEU DAS IDEIAS ABANDONADAS
echo ========================================
echo.
echo Este script vai abrir 2 terminais:
echo 1. Backend (http://localhost:3001)
echo 2. Frontend (http://localhost:5173)
echo.
echo Pressione qualquer tecla para continuar...
pause

REM Abrir Terminal 1 - Backend
start cmd /k "cd backend && npm start"

REM Aguardar um pouco
timeout /t 3 /nobreak

REM Abrir Terminal 2 - Frontend
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados!
echo.
echo Abra seu navegador em: http://localhost:5173
echo.
pause
