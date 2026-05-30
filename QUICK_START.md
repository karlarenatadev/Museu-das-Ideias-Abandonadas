# 🚀 QUICK START - MUSEU DAS IDEIAS ABANDONADAS

## ⚡ 5 MINUTOS PARA RODAR O PROJETO

### 1️⃣ Configurar Variáveis de Ambiente

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

> 💡 Obtenha sua chave Gemini em: https://makersuite.google.com/app/apikey

### 2️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3️⃣ Executar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4️⃣ Acessar a Aplicação

Abra no navegador: **http://localhost:5173**

---

## 🧪 TESTAR AGORA

1. Clique em **"✉ Abrir formulário"** (lado direito)
2. Preencha:
   - Nome: "App de Delivery"
   - Categoria: "App"
   - Empolgação: 4
   - Motivo: "Falta de capital"
3. Clique em **"🔮 Analisar Ideia"**
4. Aguarde 5-15 segundos
5. Veja o resultado com análise da IA! 🎉

---

## 🐛 PROBLEMAS?

| Problema | Solução |
|----------|---------|
| "API Offline" | Backend não está rodando. Execute `npm run dev` em `/backend` |
| Erro 500 | Verifique se `GEMINI_API_KEY` está configurada no `.env` |
| Porta em uso | Mude `PORT` no `.env` ou mate o processo anterior |
| Módulos não encontrados | Execute `npm install` novamente |

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **SETUP_COMPLETO.md** - Guia detalhado de instalação
- **CHECKLIST_INTEGRACAO.md** - Testes e validação
- **RESUMO_MUDANCAS.md** - O que foi implementado

---

## ✨ PRONTO!

Seu projeto está **100% funcional** e pronto para usar! 🏛️

Aproveite o Museu das Ideias Abandonadas! 💀✨
