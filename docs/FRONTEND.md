# Frontend

O frontend usa React com Vite e fica na pasta `frontend`.

## Entrar Na Pasta

```powershell
cd frontend
```

## Instalar Dependencias

Na raiz do projeto:

```powershell
npm install
```

Ou dentro do frontend:

```powershell
npm install
```

## Rodar Localmente

```powershell
npm run dev
```

URL local padrao:

```text
http://localhost:5173
```

## Build

```powershell
npm run build
```

## Lint

```powershell
npm run lint
```

Ou pela raiz:

```powershell
npm run lint --workspace=frontend
```

## Ambiente Local

Criar `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

## Ambiente De Producao

No Vercel:

```env
VITE_API_URL=https://museu-das-ideias-abandonadas.onrender.com
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

## Chamada Principal Para O Backend

O frontend chama:

```text
POST /api/analisar-ideia
```

Base URL vem de:

```text
VITE_API_URL
```

## Componentes Importantes

- `src/App.jsx`: estado principal, autenticacao, busca, filtros, abas e ranking.
- `src/components/AuthScreen.jsx`: tela de login.
- `src/components/AuthScreen.css`: visual da tela de login.
- `src/components/Sidebar.jsx`: sidebar responsiva.
- `styles.css`: estilos globais atuais.
- `src/services/authService.js`: login, logout e headers autenticados.
- `src/services/supabaseClient.js`: cliente Supabase.
- `src/services/ideaService.js`: chamadas para ideias e analise.

## Cuidados

Nao alterar busca, filtros, sidebar, abas, ranking ou responsividade sem testar:

```powershell
npm run build
npm run lint
npm run dev
```

