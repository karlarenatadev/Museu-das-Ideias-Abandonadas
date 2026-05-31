# Handoff Para A Equipe

## Estado Atual

O projeto tem frontend React/Vite e backend Express. O frontend esta preparado para Vercel e o backend para Render.

Backend informado para apresentacao:

```text
https://museu-das-ideias-abandonadas.onrender.com
```

Repositorio usado temporariamente para apresentacao:

```text
karlarenatadev/Museu-das-Ideias-Abandonadas
```

## O Que Esta Funcionando Localmente

Validacoes feitas nesta etapa:

- `npm run build`
- `npm run lint --workspace=frontend`
- frontend local respondeu `200`
- backend local respondeu `200` em `/api/health`
- `/api/auth/me` respondeu com sucesso
- `/api/ideas?limit=1` respondeu `200`
- URL OAuth Google via Supabase foi gerada com sucesso

## O Que Ainda Precisa Validar Com Conta Real

- login Google completo no navegador;
- login e-mail/senha com usuario real;
- criacao de conta real no Supabase;
- fluxo completo de analise com chave Gemini valida;
- deploy final no Vercel e Render depois do ultimo commit.

## Pendencias Observadas Na Validacao Local

Estes botoes aparecem na interface, mas nao possuem acao implementada diretamente no codigo atual. Nao foram corrigidos nesta etapa para evitar alterar UI/logica fora do escopo:

- sino de notificacoes no topo;
- botoes do hero: `Entrar no Museu` e `Fazer visita guiada`;
- botao `Gerar card para compartilhar`.

Quem ficar responsavel pela proxima etapa deve decidir se esses botoes serao implementados, removidos ou desabilitados com feedback visual.

Tambem foi observado que, em desenvolvimento, o backend pode retornar sessao `dev:` para login e-mail/senha quando `SUPABASE_ANON_KEY` nao esta configurada no backend. Para producao, configurar Supabase Auth corretamente.

## Como Contribuir Sem Quebrar

Fluxo recomendado:

```text
1. Criar branch
2. Alterar somente o necessario
3. Rodar npm install se dependencias mudarem
4. Rodar npm run build
5. Rodar npm run lint --workspace=frontend
6. Testar frontend e backend localmente
7. Abrir Pull Request
```

Nao fazer push direto na `main` sem testar.

## Nao Subir Para Git

- `node_modules`
- `dist`
- `.env`
- tokens
- chaves Supabase
- chaves Gemini
- senhas SMTP

## Arquivos Sensíveis

Alterar com cuidado:

- `frontend/src/App.jsx`
- `frontend/src/components/AuthScreen.jsx`
- `frontend/src/components/AuthScreen.css`
- `frontend/src/services/authService.js`
- `frontend/src/services/supabaseClient.js`
- `frontend/styles.css`
- `frontend/src/components/Sidebar.jsx`
- `backend/src/server.js`
- `backend/src/routes/auth.js`
- `backend/src/routes/ideas.js`
- `backend/src/services/IdeaService.js`
- `backend/src/services/GeminiService.js`
- arquivos `.env.example`

## Checklist Antes De Entregar

- app abre localmente;
- login Google testado;
- login e-mail/senha testado;
- logout testado;
- busca testada;
- filtros testados;
- sidebar mobile testada;
- abas do memorial testadas;
- ranking/cards testados;
- build passando;
- lint passando;
- `.env` configurado;
- deploy apontando para o repositorio certo.
