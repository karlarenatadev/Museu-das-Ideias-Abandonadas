# 🏛️ Museu das Ideias Abandonadas

Um museu digital que celebra projetos que nunca saíram do papel. Envie sua ideia abandonada e receba uma análise sarcástica, poética e reconfortante da **Curadora do Caos** - uma IA com personalidade única.

## 🎯 Sobre o Projeto

Este projeto é composto por:
- **Frontend**: Interface React com Tailwind CSS
- **Backend**: API Node.js + Express integrada com Google Gemini AI

## 🚀 Como Rodar

### Backend

```bash
cd backend
npm install
copy .env.example .env
# Edite .env e adicione sua GEMINI_API_KEY
npm run dev
```

**Obter chave do Gemini:** https://makersuite.google.com/app/apikey

### Frontend

```bash
cd museu-das-ideias
npm install
npm run dev
```

## 📁 Estrutura

```
Museu-das-Ideias-Abandonadas/
├── backend/              # API Node.js + Express + Gemini
│   ├── server.js        # Servidor principal
│   ├── package.json     # Dependências
│   └── .env.example     # Template de configuração
│
└── museu-das-ideias/    # Frontend React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx      # Componente principal
    │   └── main.jsx     # Entry point
    └── package.json     # Dependências
```

## 🎭 A Curadora do Caos

A IA analisa suas ideias abandonadas com:
- 📊 Análise objetiva de sobrevivência
- 🎨 Linguagem poética sobre fracassos
- 😏 Sarcasmo reconfortante
- 💜 Empatia e celebração do processo criativo

## 🛠️ Stack

**Backend:**
- Node.js + Express
- Google Gemini AI
- CORS + dotenv

**Frontend:**
- React 19
- Vite
- Tailwind CSS v4

## 📝 Licença

MIT License - Veja [LICENSE](LICENSE)

---

**Desenvolvido com 💜 e um toque de sarcasmo existencial**
