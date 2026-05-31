# 🏛️ Museu das Ideias Abandonadas — Backend API

Backend Node.js que serve como ponte entre o frontend React e a API do Google Gemini para análise sarcástica e poética de ideias abandonadas.

## Stack

- **Node.js + Express** — servidor HTTP
- **Google Gemini 2.0 Flash** — análise das ideias
- **Helmet** — headers de segurança HTTP
- **express-rate-limit** — proteção contra abuso de API
- **Pino** — logging estruturado (JSON em produção, pretty em dev)
- **Nodemailer** — e-mails de confirmação de assinatura
- **Supabase** — persistência (opcional)

## Estrutura

```
backend/
├── src/
│   ├── config/
│   │   ├── gemini.js        # Singleton do cliente Gemini
│   │   ├── logger.js        # Logger pino
│   │   └── mailer.js        # Singleton do transporter SMTP
│   ├── middleware/
│   │   ├── rateLimiter.js   # Rate limits por rota
│   │   ├── requestLogger.js # Log HTTP estruturado
│   │   └── validateIdeia.js # Validação + sanitização do body
│   ├── routes/
│   │   ├── health.js        # GET  /api/health
│   │   ├── ideas.js         # POST /api/analisar-ideia
│   │   └── alerts.js        # POST /api/assinar-alertas
│   ├── services/
│   │   ├── GeminiService.js # Lógica de prompt e parse da IA
│   │   └── MailService.js   # Lógica de envio de e-mail
│   └── server.js            # Boot: middlewares, rotas, servidor
├── .env.example
├── .gitignore
└── package.json
```

## Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua chave Gemini e dados SMTP
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Chave da API Google Gemini |
| `FRONTEND_URL` | ✅ | URL do frontend para CORS (ex: `http://localhost:5173`) |
| `NODE_ENV` | recomendado | `development` ou `production` |
| `PORT` | não | Porta do servidor (padrão: `3001`) |
| `LOG_LEVEL` | não | Nível de log pino (padrão: `info`) |
| `SMTP_HOST` | e-mail | Host SMTP |
| `SMTP_PORT` | e-mail | Porta SMTP |
| `SMTP_SECURE` | e-mail | `true` para TLS (porta 465) |
| `SMTP_USER` | e-mail | Usuário SMTP |
| `SMTP_PASS` | e-mail | Senha de app SMTP |
| `MAIL_FROM` | e-mail | Remetente dos e-mails |
| `SUPABASE_URL` | Supabase | URL do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Chave service role |

> **Nota:** as variáveis SMTP são opcionais. Se não configuradas, o servidor sobe normalmente e apenas loga um aviso — o endpoint `/api/assinar-alertas` retornará erro 500 ao ser chamado.

## Executar

```bash
npm run dev    # desenvolvimento com auto-reload
npm start      # produção
```

## Endpoints

### `GET /api/health`

Verifica se o servidor está no ar.

### `POST /api/analisar-ideia`

Analisa uma ideia abandonada com a Curadora do Caos.

Rate limit: **5 requisições por minuto por IP**.

**Body:**
```json
{
  "nome": "App de delivery de sonhos",
  "categoria": "Startup",
  "empolgacao": 5,
  "motivo": "Sonhos não cabem em caixas"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "survival_percentage": 12,
    "cause_of_death_summary": "Morreu de idealismo agudo",
    "ai_verdict": "Ah, a clássica morte por romantismo excessivo..."
  }
}
```

### `POST /api/assinar-alertas`

Assina alertas e envia e-mail de confirmação.

**Body:**
```json
{
  "email": "visitante@exemplo.com"
}
```

## Testar com cURL

```bash
curl -X POST http://localhost:3001/api/analisar-ideia \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rede social para pedras","categoria":"App","empolgacao":4,"motivo":"Pedras não têm WiFi"}'
```

---

**Desenvolvido com 💜 e sarcasmo existencial**
