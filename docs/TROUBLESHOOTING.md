# Troubleshooting

## Render Procurando `frontend/dist/index.html`

Causa: backend tentando servir arquivos estaticos do frontend.

Solucao: se o frontend esta no Vercel, o backend deve funcionar como API only. Verificar se o Render esta rodando a versao correta do backend.

## Rota Retorna "Esta rota tambem foi abandonada..."

Causa comum:

- rota incorreta;
- chamada `GET` em rota que espera `POST`;
- backend publicado em versao diferente da esperada.

Solucao:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
```

Para analise, usar `POST`:

```text
POST /api/analisar-ideia
```

## `/health` Ou `/api/health`?

O briefing do deploy informa:

```text
GET /health
```

No backend estruturado atual do repositorio, a rota validada localmente e:

```text
GET /api/health
```

Se um retornar 404, testar o outro e alinhar a configuracao do Render/start command.

## Vercel: `Cannot find native binding`

Exemplos:

```text
Cannot find native binding
@rolldown/binding-linux-x64-gnu
```

Causa provavel: dependencia opcional nativa nao instalada corretamente.

Solucao no Vercel:

```text
npm install --no-package-lock --include=optional
```

## Erro `Cannot find module '@tailwindcss/postcss'`

Causa: dependencia ausente no frontend.

Solucao:

```powershell
cd frontend
npm install -D @tailwindcss/postcss
npm run build
```

## Comando Rodado Na Pasta Errada

Raiz:

```powershell
npm install
npm run build
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
npm run build
npm run lint
```

Backend:

```powershell
cd backend
npm run dev
npm start
```

## Repositorios Diferentes

Para apresentacao, o deploy valido do Vercel esta conectado ao repositorio:

```text
karlarenatadev/Museu-das-Ideias-Abandonadas
```

Se outra pessoa fizer commit no repositorio principal, o Vercel pode nao atualizar. Confirmar sempre qual repositorio esta conectado ao deploy.

## Login Nao Funciona

Verificar:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Google Provider ativo no Supabase
- Email/Password ativo no Supabase
- Redirect URLs do Supabase
- backend com `SUPABASE_ANON_KEY` se for usar auth por backend em producao

## Botao Parece Clicar Mas Nada Acontece

Abrir DevTools e conferir:

- Console
- Network
- status das chamadas
- variaveis `.env`
- se o backend esta online

Nao corrigir as cegas. Primeiro identificar qual endpoint ou variavel falhou.

