# Script de Diagnóstico - Museu das Ideias Abandonadas
# Verifica todos os pré-requisitos para npm run dev funcionar

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║     🔧 DIAGNÓSTICO - npm run dev                              ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Cores
$success = "Green"
$error = "Red"
$warning = "Yellow"
$info = "Cyan"

# 1. Verificar Node.js
Write-Host "1️⃣  Verificando Node.js..." -ForegroundColor $info
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js instalado: $nodeVersion" -ForegroundColor $success
    
    # Verificar versão
    $version = $nodeVersion -replace 'v', '' -split '\.' | Select-Object -First 1
    if ([int]$version -ge 18) {
        Write-Host "   ✅ Versão adequada (v18+)" -ForegroundColor $success
    } else {
        Write-Host "   ❌ Versão muito antiga (requer v18+)" -ForegroundColor $error
    }
} else {
    Write-Host "   ❌ Node.js NÃO instalado" -ForegroundColor $error
}

# 2. Verificar npm
Write-Host "`n2️⃣  Verificando npm..." -ForegroundColor $info
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "   ✅ npm instalado: v$npmVersion" -ForegroundColor $success
} else {
    Write-Host "   ❌ npm NÃO instalado" -ForegroundColor $error
}

# 3. Verificar Backend
Write-Host "`n3️⃣  Verificando Backend..." -ForegroundColor $info

if (Test-Path "backend") {
    Write-Host "   ✅ Pasta backend encontrada" -ForegroundColor $success
    
    # Verificar node_modules
    if (Test-Path "backend/node_modules") {
        Write-Host "   ✅ node_modules instalado" -ForegroundColor $success
    } else {
        Write-Host "   ❌ node_modules NÃO encontrado" -ForegroundColor $error
        Write-Host "      Execute: cd backend && npm install" -ForegroundColor $warning
    }
    
    # Verificar .env
    if (Test-Path "backend/.env") {
        Write-Host "   ✅ Arquivo .env encontrado" -ForegroundColor $success
        
        # Verificar se tem GEMINI_API_KEY
        $envContent = Get-Content "backend/.env"
        if ($envContent -match "GEMINI_API_KEY=") {
            $hasKey = $envContent -match "GEMINI_API_KEY=.+"
            if ($hasKey) {
                Write-Host "   ✅ GEMINI_API_KEY configurado" -ForegroundColor $success
            } else {
                Write-Host "   ❌ GEMINI_API_KEY vazio" -ForegroundColor $error
                Write-Host "      Adicione sua chave em backend/.env" -ForegroundColor $warning
            }
        } else {
            Write-Host "   ❌ GEMINI_API_KEY não encontrado" -ForegroundColor $error
            Write-Host "      Adicione em backend/.env: GEMINI_API_KEY=sua_chave" -ForegroundColor $warning
        }
    } else {
        Write-Host "   ❌ Arquivo .env NÃO encontrado" -ForegroundColor $error
        Write-Host "      Execute: copy backend/.env.example backend/.env" -ForegroundColor $warning
    }
    
    # Verificar package.json
    if (Test-Path "backend/package.json") {
        Write-Host "   ✅ package.json encontrado" -ForegroundColor $success
    } else {
        Write-Host "   ❌ package.json NÃO encontrado" -ForegroundColor $error
    }
} else {
    Write-Host "   ❌ Pasta backend NÃO encontrada" -ForegroundColor $error
}

# 4. Verificar Frontend
Write-Host "`n4️⃣  Verificando Frontend..." -ForegroundColor $info

if (Test-Path "museu-das-ideias") {
    Write-Host "   ✅ Pasta frontend encontrada" -ForegroundColor $success
    
    # Verificar node_modules
    if (Test-Path "museu-das-ideias/node_modules") {
        Write-Host "   ✅ node_modules instalado" -ForegroundColor $success
    } else {
        Write-Host "   ❌ node_modules NÃO encontrado" -ForegroundColor $error
        Write-Host "      Execute: cd museu-das-ideias && npm install" -ForegroundColor $warning
    }
    
    # Verificar .env
    if (Test-Path "museu-das-ideias/.env") {
        Write-Host "   ✅ Arquivo .env encontrado" -ForegroundColor $success
        
        # Verificar VITE_API_URL
        $envContent = Get-Content "museu-das-ideias/.env"
        if ($envContent -match "VITE_API_URL") {
            Write-Host "   ✅ VITE_API_URL configurado" -ForegroundColor $success
        } else {
            Write-Host "   ⚠️  VITE_API_URL não encontrado" -ForegroundColor $warning
        }
    } else {
        Write-Host "   ⚠️  Arquivo .env NÃO encontrado" -ForegroundColor $warning
        Write-Host "      Não é crítico, mas recomendado" -ForegroundColor $info
    }
    
    # Verificar package.json
    if (Test-Path "museu-das-ideias/package.json") {
        Write-Host "   ✅ package.json encontrado" -ForegroundColor $success
    } else {
        Write-Host "   ❌ package.json NÃO encontrado" -ForegroundColor $error
    }
} else {
    Write-Host "   ❌ Pasta frontend NÃO encontrada" -ForegroundColor $error
}

# 5. Verificar Portas
Write-Host "`n5️⃣  Verificando Portas..." -ForegroundColor $info

$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port3001) {
    Write-Host "   ⚠️  Porta 3001 já está em uso" -ForegroundColor $warning
    Write-Host "      Feche o processo ou use outra porta" -ForegroundColor $info
} else {
    Write-Host "   ✅ Porta 3001 disponível" -ForegroundColor $success
}

if ($port5173) {
    Write-Host "   ⚠️  Porta 5173 já está em uso" -ForegroundColor $warning
    Write-Host "      Feche o processo ou use outra porta" -ForegroundColor $info
} else {
    Write-Host "   ✅ Porta 5173 disponível" -ForegroundColor $success
}

# Resumo
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                      RESUMO DO DIAGNÓSTICO                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "✅ Se todos os itens acima estão verdes, execute:" -ForegroundColor $success
Write-Host "`n   Terminal 1 (Backend):`n   cd backend && npm run dev`n" -ForegroundColor $info
Write-Host "   Terminal 2 (Frontend):`n   cd museu-das-ideias && npm run dev`n" -ForegroundColor $info

Write-Host "❌ Se algum item está vermelho, siga as instruções acima." -ForegroundColor $error

Write-Host "`n📚 Para mais informações, consulte: DIAGNOSTICO_NPM_RUN_DEV.md`n" -ForegroundColor $info
