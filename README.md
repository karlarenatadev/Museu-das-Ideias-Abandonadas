# Museu das Ideias Abandonadas

Uma experiencia web para registrar ideias que ficaram pelo caminho e transformar abandono em analise, humor e aprendizado.

## O Que O Projeto Faz

O usuario acessa a aplicacao, faz login, registra uma ideia abandonada e recebe uma analise criativa gerada por IA. A interface tambem organiza cards, filtros, busca, ranking e um memorial visual das ideias.

## Tecnologias

- Frontend: React, Vite, CSS responsivo
- Backend: Node.js, Express
- IA: Google Gemini
- Autenticacao: Supabase Auth no frontend e rotas de apoio no backend
- Banco/servicos: Supabase, quando configurado
- Deploy frontend: Vercel
- Deploy backend: Render

## Estrutura Geral

```mermaid
Flowchart TD
A[Estrutura Geral] --> B[frontend/Aplicacao React/Vite] 
A[Estrutura Geral] --> C[backend/API Express]
C --> C1[src/Backend estruturado com rotas, services e middlewares]
C --> C2[server.js /Backend legado/simples mantido no historico do projeto]
A[Estrutura Geral] --> D[docs/Documentacao de deploy, ambiente e handoff]
A[Estrutura Geral] --> E[package.json /Scripts da raiz com workspaces]
A[Estrutura Geral] --> F[package-lock.json]
```

````text

├── frontend/          # Aplicacao React/Vite
├── backend/           # API Express
│   ├── src/           # Backend estruturado com rotas, services e middlewares
│   └── server.js      # Backend legado/simples mantido no historico do projeto
├── docs/              # Documentacao de deploy, ambiente e handoff
├── package.json       # Scripts da raiz com workspaces
└── package-lock.json
```

Nao envie para o Git:

- `node_modules`
- `dist`
- `.env`
- arquivos com tokens, chaves ou segredos

## Como Rodar Localmente

Instale dependencias na raiz:

```powershell
npm install
```

Backend:

```powershell
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

Por padrao:

- Frontend local: `http://localhost:5173`
- Backend local: `http://localhost:3001`

## Variaveis De Ambiente

Frontend local:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

Frontend em producao:

```env
VITE_API_URL=https://museu-das-ideias-abandonadas.onrender.com
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

Backend:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_aqui
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_anon_key_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Nao coloque valores reais de segredo na documentacao.

## Como Testar

Build do frontend:

```powershell
npm run build
```

Lint do frontend:

```powershell
npm run lint --workspace=frontend
```

Health local do backend atual:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
```

Analise de ideia:

```powershell
$body = @{
  nome = "App de lembrar guarda-chuva"
  categoria = "Aplicativo"
  empolgacao = 4
  motivo = "Nunca saiu do Figma"
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "http://localhost:3001/api/analisar-ideia" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

## Deploy

Backend Render:

- `https://museu-das-ideias-abandonadas.onrender.com`
- Health informado para apresentacao: `https://museu-das-ideias-abandonadas.onrender.com/health`
- Observacao tecnica: no backend estruturado atual, a rota local validada e `GET /api/health`. Se `/health` retornar 404, alinhar o start command/versao do backend no Render.

Frontend Vercel:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --no-package-lock --include=optional`
- Environment Variable: `VITE_API_URL=https://museu-das-ideias-abandonadas.onrender.com`

Para a apresentacao, o deploy valido esta conectado ao repositorio:

```text
karlarenatadev/Museu-das-Ideias-Abandonadas
```

Depois, a equipe pode alinhar a migracao para o repositorio principal.

## Documentacao

- [Deploy](docs/DEPLOY.md)
- [Frontend](docs/FRONTEND.md)
- [Backend](docs/BACKEND.md)
- [Ambiente](docs/ENVIRONMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Handoff](docs/HANDOFF.md)
- [Pitch e perguntas de mentores](docs/PITCH_MENTORES.md)

