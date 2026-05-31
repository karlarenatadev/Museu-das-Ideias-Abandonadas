# 🏗️ ARQUITETURA DO PROJETO - MUSEU DAS IDEIAS ABANDONADAS

## 📐 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR DO USUÁRIO                            │
│                      http://localhost:5173                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ App.jsx - Componente Principal                                   │  │
│  │ ├── Sidebar.jsx - Navegação                                      │  │
│  │ │   └── ApiStatus.jsx - Status da API                            │  │
│  │ ├── FormModal.jsx - Modal do Formulário                          │  │
│  │ │   └── IdeaForm.jsx - Formulário de Submissão                   │  │
│  │ │       ├── Validação Local                                      │  │
│  │ │       ├── Chamada à API (ideaService.js)                       │  │
│  │ │       └── AnalysisResult.jsx - Exibição de Resultado           │  │
│  │ └── Outros Componentes (MuseumModal, etc)                        │  │
│  │                                                                   │  │
│  │ Services:                                                         │  │
│  │ └── ideaService.js                                               │  │
│  │     ├── analyzeIdea(ideaData)                                    │  │
│  │     └── checkApiHealth()                                         │  │
│  │                                                                   │  │
│  │ Config:                                                           │  │
│  │ └── api.js                                                        │  │
│  │     └── API_ENDPOINTS (URLs relativas)                           │  │
│  │                                                                   │  │
│  │ Styles:                                                           │  │
│  │ └── index.css                                                     │  │
│  │     ├── Tailwind CSS                                             │  │
│  │     └── Animações Customizadas                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Build Tool: Vite                                                       │
│  Framework: React 19.2.6                                                │
│  Styling: Tailwind CSS 4.3.0                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                        HTTP/REST (JSON)
                                    ↓
        ┌───────────────────────────────────────────────────┐
        │  POST /api/analisar-ideia                         │
        │  GET  /api/health                                 │
        └───────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + Node.js)                          │
│                      http://localhost:3001                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ server.js - Servidor Express                                     │  │
│  │                                                                   │  │
│  │ Middlewares:                                                      │  │
│  │ ├── CORS - Permite requisições do frontend                       │  │
│  │ ├── express.json() - Parse de JSON                               │  │
│  │ └── express.static() - Servir arquivos estáticos                 │  │
│  │                                                                   │  │
│  │ Rotas:                                                            │  │
│  │ ├── GET /api/health                                              │  │
│  │ │   └── Verifica se servidor está online                         │  │
│  │ │                                                                 │  │
│  │ ├── POST /api/analisar-ideia                                     │  │
│  │ │   ├── Validação de entrada                                     │  │
│  │ │   ├── Construção do prompt                                     │  │
│  │ │   ├── Chamada ao Gemini                                        │  │
│  │ │   ├── Parse da resposta                                        │  │
│  │ │   └── Retorno ao frontend                                      │  │
│  │ │                                                                 │  │
│  │ └── 404 - Fallback para SPA                                       │  │
│  │                                                                   │  │
│  │ Integração:                                                       │  │
│  │ └── Google Generative AI (Gemini)                                │  │
│  │     └── model: gemini-2.5-flash                                  │  │
│  │                                                                   │  │
│  │ Configuração:                                                     │  │
│  │ └── .env                                                          │  │
│  │     ├── PORT=3001                                                │  │
│  │     ├── NODE_ENV=development                                     │  │
│  │     └── GEMINI_API_KEY=***                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Runtime: Node.js 18+                                                   │
│  Framework: Express 4.18.2                                              │
│  CORS: 2.8.5                                                            │
│  Dotenv: 16.3.1                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                        HTTP/REST (JSON)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    GOOGLE GEMINI API (Cloud)                            │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Modelo: gemini-2.5-flash                                         │  │
│  │                                                                   │  │
│  │ Entrada:                                                          │  │
│  │ ├── Nome da ideia                                                │  │
│  │ ├── Categoria                                                    │  │
│  │ ├── Nível de empolgação                                          │  │
│  │ └── Motivo do abandono                                           │  │
│  │                                                                   │  │
│  │ Processamento:                                                    │  │
│  │ └── Análise sarcástica e poética da ideia                        │  │
│  │                                                                   │  │
│  │ Saída (JSON):                                                     │  │
│  │ ├── survival_percentage (0-100)                                  │  │
│  │ ├── cause_of_death_summary (string)                              │  │
│  │ └── ai_verdict (string)                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados Completo

```
1. USUÁRIO INTERAGE
   └─ Clica em "✉ Abrir formulário"
      └─ Modal abre com IdeaForm

2. USUÁRIO PREENCHE FORMULÁRIO
   └─ Nome, Categoria, Empolgação, Motivo
      └─ Validação local em tempo real

3. USUÁRIO SUBMETE
   └─ Clica em "🔮 Analisar Ideia"
      └─ Spinner de carregamento aparece
         └─ Botão fica desabilitado

4. FRONTEND ENVIA REQUISIÇÃO
   └─ POST /api/analisar-ideia
      └─ Headers: Content-Type: application/json
         └─ Body: { nome, categoria, empolgacao, motivo }

5. BACKEND RECEBE
   └─ Valida campos obrigatórios
      └─ Valida range de empolgação (1-5)
         └─ Constrói prompt para IA

6. BACKEND ENVIA PARA GEMINI
   └─ Chamada assíncrona ao modelo
      └─ Aguarda resposta (5-15 segundos)

7. GEMINI PROCESSA
   └─ Analisa ideia com persona "Curadora do Caos"
      └─ Retorna JSON com análise

8. BACKEND PROCESSA RESPOSTA
   └─ Remove formatação markdown
      └─ Faz parse do JSON
         └─ Valida estrutura
            └─ Retorna ao frontend

9. FRONTEND RECEBE RESPOSTA
   └─ Valida status HTTP (200)
      └─ Extrai dados
         └─ Renderiza AnalysisResult

10. USUÁRIO VÊ RESULTADO
    └─ Animação de entrada (fadeIn)
       └─ Porcentagem com cor dinâmica
          └─ Causa da morte
             └─ Veredito da IA
                └─ Scroll automático
```

---

## 📦 Estrutura de Pastas

```
Museu-das-Ideias-Abandonadas/
│
├── backend/
│   ├── server.js                 # Servidor Express principal
│   ├── package.json              # Dependências
│   ├── package-lock.json         # Lock file
│   ├── .env                       # Variáveis de ambiente (não commitar)
│   ├── .env.example              # Template
│   ├── .gitignore                # Ignora node_modules e .env
│   └── README.md                 # Documentação do backend
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Componente raiz
│   │   ├── main.jsx              # Entry point
│   │   ├── index.css             # Estilos globais + animações
│   │   │
│   │   ├── components/
│   │   │   ├── IdeaForm.jsx      # Formulário principal
│   │   │   ├── AnalysisResult.jsx # Resultado da análise
│   │   │   ├── FormModal.jsx     # Modal wrapper
│   │   │   ├── ApiStatus.jsx     # Status da API
│   │   │   ├── Sidebar.jsx       # Navegação
│   │   │   ├── MuseumModal.jsx   # Modal do museu
│   │   │   ├── ModalContent.jsx  # Conteúdo dos modais
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   └── ideaService.js    # Chamadas à API
│   │   │
│   │   ├── config/
│   │   │   └── api.js            # Configuração de endpoints
│   │   │
│   │   └── assets/
│   │       └── (imagens, ícones)
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── dist/                      # Build output (gerado)
│   ├── package.json              # Dependências
│   ├── package-lock.json         # Lock file
│   ├── vite.config.js            # Configuração do Vite
│   ├── tailwind.config.js        # Configuração do Tailwind
│   ├── postcss.config.js         # Configuração do PostCSS
│   ├── eslint.config.js          # Configuração do ESLint
│   ├── .env                       # Variáveis de ambiente
│   ├── .env.example              # Template
│   ├── .gitignore                # Ignora node_modules e .env
│   └── index.html                # HTML principal
│
├── .git/                          # Repositório Git
├── .kiro/                         # Configuração do Kiro
├── .vscode/                       # Configuração do VS Code
│
├── SETUP_COMPLETO.md             # Guia de instalação
├── CHECKLIST_INTEGRACAO.md       # Checklist de testes
├── RESUMO_MUDANCAS.md            # Resumo das mudanças
├── QUICK_START.md                # Quick start
├── ARQUITETURA.md                # Este arquivo
├── AUDITORIA_FRONTEND.md         # Auditoria anterior
├── diagnostico.ps1               # Script de diagnóstico
├── package.json                  # Root package.json
├── package-lock.json             # Root lock file
├── README.md                      # Documentação principal
└── LICENSE                        # Licença MIT
```

---

## 🔌 Integrações Externas

### Google Gemini API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Autenticação**: API Key via variável de ambiente
- **Método**: REST POST
- **Timeout**: 30 segundos (padrão)
- **Rate Limit**: Depende do plano

---

## 🔐 Fluxo de Segurança

```
┌─────────────────────────────────────────────────────────────┐
│ 1. VALIDAÇÃO NO FRONTEND                                    │
│    ├─ Campos obrigatórios                                   │
│    ├─ Tipo de dados                                         │
│    └─ Comprimento máximo                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. TRANSMISSÃO SEGURA                                       │
│    ├─ HTTPS (em produção)                                   │
│    ├─ CORS validado                                         │
│    └─ Content-Type: application/json                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDAÇÃO NO BACKEND                                     │
│    ├─ Campos obrigatórios                                   │
│    ├─ Range de valores                                      │
│    └─ Tipo de dados                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PROTEÇÃO DE CHAVES                                       │
│    ├─ GEMINI_API_KEY em .env (não commitar)                │
│    ├─ Nunca expor em logs                                   │
│    └─ Usar variáveis de ambiente                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. RESPOSTA SEGURA                                          │
│    ├─ Validação de estrutura JSON                           │
│    ├─ Sem exposição de erros internos                       │
│    └─ Mensagens temáticas para usuário                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Componentes e Responsabilidades

| Componente | Responsabilidade | Tecnologia |
|-----------|-----------------|-----------|
| App.jsx | Orquestração principal | React |
| IdeaForm.jsx | Coleta de dados | React + Tailwind |
| AnalysisResult.jsx | Exibição de resultado | React + Tailwind + CSS |
| ApiStatus.jsx | Monitoramento de status | React |
| ideaService.js | Comunicação com API | Fetch API |
| server.js | Processamento de requisições | Express |
| Gemini API | Análise de ideias | Google Cloud |

---

## 🚀 Fluxo de Deploy

```
┌─────────────────────────────────────────────────────────────┐
│ DESENVOLVIMENTO                                             │
│ ├─ Frontend: npm run dev (Vite dev server)                 │
│ └─ Backend: npm run dev (Node --watch)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ BUILD                                                       │
│ ├─ Frontend: npm run build (Vite build)                    │
│ │   └─ Output: frontend/dist/                              │
│ └─ Backend: Sem build necessário                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PRODUÇÃO                                                    │
│ ├─ Backend: npm start (Node server.js)                     │
│ │   └─ Serve frontend/dist como arquivos estáticos         │
│ └─ Frontend: Servido pelo backend                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Pontos de Integração Críticos

1. **Frontend → Backend**
   - URL: `/api/analisar-ideia`
   - Método: POST
   - Validação: Campos obrigatórios

2. **Backend → Gemini**
   - Autenticação: API Key
   - Timeout: 30 segundos
   - Retry: Não implementado (adicionar se necessário)

3. **Gemini → Backend**
   - Formato: JSON
   - Validação: Estrutura esperada
   - Tratamento: Parse e validação

4. **Backend → Frontend**
   - Status: 200 (sucesso) ou 400/500 (erro)
   - Formato: JSON
   - Campos: success, data/error

---

## 📈 Escalabilidade

### Atual (Desenvolvimento)
- ✅ Funciona localmente
- ✅ Sem banco de dados
- ✅ Sem autenticação
- ✅ Sem cache

### Próximos Passos
- 🔄 Adicionar banco de dados (MongoDB/PostgreSQL)
- 🔄 Implementar autenticação (JWT)
- 🔄 Adicionar cache (Redis)
- 🔄 Implementar rate limiting
- 🔄 Adicionar logging centralizado
- 🔄 Implementar CI/CD

---

**Versão**: 1.0.0
**Data**: 30 de Maio de 2026
**Status**: ✅ Documentado e Validado
