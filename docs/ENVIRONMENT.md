# Variaveis De Ambiente

Nao commitar arquivos `.env`. Use `.env.example` como referencia e configure valores reais apenas nos ambientes locais, Vercel ou Render.

## Frontend

Local:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

Producao:

```env
VITE_API_URL=https://museu-das-ideias-abandonadas.onrender.com
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

## Backend

Variaveis encontradas no codigo:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_aqui
OPENROUTER_API_KEY=sua_chave_openrouter_aqui
OPENROUTER_MODEL=google/gemini-2.0-flash-001
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_anon_key_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email
SMTP_PASS=sua_senha_de_app
MAIL_FROM="Museu das Ideias Abandonadas <seu_email>"
```

## Obrigatorias

Para backend com Gemini:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Se `AI_PROVIDER=openrouter`, o backend espera:

```env
OPENROUTER_API_KEY=sua_chave_aqui
```

Para autenticacao e persistencia Supabase completas:

```env
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_anon_key_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Para login Google no frontend:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_supabase
```

## Nao Enviar Para Git

- `.env`
- `.env.local`
- `.env.production`
- chaves Supabase
- chaves Gemini
- senhas SMTP

