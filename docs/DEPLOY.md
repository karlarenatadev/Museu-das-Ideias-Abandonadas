# Deploy

Este projeto esta dividido em dois deploys:

- Frontend no Vercel
- Backend no Render

## Backend No Render

Backend informado para apresentacao:

```text
https://museu-das-ideias-abandonadas.onrender.com
```

Rota principal:

```text
POST /api/analisar-ideia
```

Health informado no briefing:

```text
GET /health
```

Observacao tecnica importante: no backend estruturado atual do repositorio, a rota validada localmente e:

```text
GET /api/health
```

Se o Render responder 404 em `/health`, testar `/api/health` e alinhar a versao/start command do backend publicado.

## Frontend No Vercel

Configuracao esperada:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install --no-package-lock --include=optional
```

Variavel de ambiente no Vercel:

```env
VITE_API_URL=https://museu-das-ideias-abandonadas.onrender.com
```

Tambem configurar Supabase Auth se o login estiver ativo:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

## Repositorio Usado Na Apresentacao

O Vercel esta usando temporariamente:

```text
karlarenatadev/Museu-das-Ideias-Abandonadas
```

Isso aconteceu porque o deploy estava conectado a conta da Karla. Para apresentacao, considerar esse deploy como o valido. Depois, a equipe pode alinhar a migracao para o repositorio principal.

## Cuidados

- Frontend e backend sao deploys separados.
- Nao subir `node_modules`, `dist` ou `.env`.
- Sempre rodar `npm run build` antes de atualizar deploy.
- Confirmar que o Vercel esta conectado ao repositorio que recebeu o commit mais recente.

