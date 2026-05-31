# Backend

O backend usa Node.js e Express.

## Estrutura Atual

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── server.js
├── server.js
├── package.json
└── .env.example
```

O `package.json` do backend aponta para:

```text
src/server.js
```

Existe tambem um `backend/server.js` legado/simples. Cuidado para nao publicar a versao errada sem querer.

## Entrar Na Pasta

```powershell
cd backend
```

## Instalar Dependencias

Na raiz:

```powershell
npm install
```

Ou no backend:

```powershell
npm install
```

## Rodar

Pela raiz:

```powershell
npm run dev
```

Dentro do backend:

```powershell
npm run dev
```

Producao:

```powershell
npm start
```

Alternativa direta:

```powershell
node src/server.js
```

## Porta Padrao

```text
3001
```

## Rotas Principais

Health local validado:

```text
GET http://localhost:3001/api/health
```

Endpoint principal:

```text
POST http://localhost:3001/api/analisar-ideia
```

Rotas de autenticacao:

```text
POST /api/auth/login
POST /api/auth/signup
GET  /api/auth/me
```

Rotas de ideias:

```text
GET  /api/ideas
POST /api/ideas/analyze
POST /api/ideas/:id/honor
POST /api/ideas/:id/candle
POST /api/ideas/:id/revive
POST /api/ideas/:id/die-again
```

## Teste Com PowerShell

Health:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
```

Analise:

```powershell
$body = @{
  nome = "Agenda que manda bronca"
  categoria = "Aplicativo"
  empolgacao = 4
  motivo = "O projeto ficou parado"
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "http://localhost:3001/api/analisar-ideia" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing
```

## Limitacoes Atuais

- Gemini exige `GEMINI_API_KEY`.
- Supabase exige variaveis proprias para persistencia e auth completos.
- SMTP e opcional; sem SMTP o servidor sobe, mas envio de e-mail pode falhar.
- Em desenvolvimento, se Supabase Auth nao estiver configurado no backend, o login e-mail/senha pode usar sessao `dev:`. Em producao, isso deve ser configurado corretamente com Supabase.

