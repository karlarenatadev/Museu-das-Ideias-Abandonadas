#!/bin/bash

# Script para iniciar o projeto localmente em Mac/Linux

echo ""
echo "========================================"
echo "🏛️  MUSEU DAS IDEIAS ABANDONADAS"
echo "========================================"
echo ""
echo "Este script vai abrir 2 terminais:"
echo "1. Backend (http://localhost:3001)"
echo "2. Frontend (http://localhost:5173)"
echo ""

# Abrir Terminal 1 - Backend
echo "Iniciando Backend..."
open -a Terminal "$(pwd)/backend"
cd backend && npm start &

# Aguardar um pouco
sleep 3

# Abrir Terminal 2 - Frontend
echo "Iniciando Frontend..."
open -a Terminal "$(pwd)/frontend"
cd frontend && npm run dev &

echo ""
echo "✅ Servidores iniciados!"
echo ""
echo "Abra seu navegador em: http://localhost:5173"
echo ""

wait
