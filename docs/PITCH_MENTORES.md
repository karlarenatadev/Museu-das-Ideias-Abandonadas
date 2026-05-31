# Pitch E Perguntas De Mentores

## Pitch De 30 Segundos

O Museu das Ideias Abandonadas e uma aplicacao web que transforma projetos esquecidos em uma experiencia criativa. O usuario registra uma ideia que nao foi para frente, recebe uma analise com IA e navega por um memorial visual com cards, filtros e ranking. A proposta e tirar o peso do fracasso e transformar ideias abandonadas em aprendizado, humor e narrativa.

## Pitch De 1 A 2 Minutos

Muitas pessoas comecam projetos, aplicativos, startups ou ideias pessoais que acabam parando no meio do caminho. Normalmente essas ideias ficam escondidas, associadas a culpa ou frustracao.

O Museu das Ideias Abandonadas cria um espaco para registrar essas ideias e dar a elas um encerramento criativo. O usuario faz login, envia nome, categoria, nivel de empolgacao e motivo do abandono. O backend usa IA para gerar uma analise com tom poetico, sarcastico e acolhedor. O frontend apresenta isso em uma experiencia visual com busca, filtros, memorial, ranking e cards responsivos.

O diferencial do projeto e misturar tecnologia, narrativa e humor para ressignificar o fracasso criativo. Em vez de vender produtividade perfeita, o app reconhece que abandonar ideias faz parte do processo de criar. O impacto esperado e ajudar estudantes, makers e equipes a refletirem sobre seus projetos interrompidos e voltarem a criar com menos peso.

## Perguntas Provaveis E Respostas Sugeridas

**Qual problema o projeto resolve?**  
Ajuda pessoas a registrarem e ressignificarem ideias abandonadas, transformando frustracao em aprendizado e narrativa.

**Quem e o usuario final?**  
Pessoas criativas, estudantes, makers, times de produto e qualquer pessoa que tenha projetos inacabados.

**Por que React/Vite?**  
Porque permite construir uma SPA rapida, responsiva e simples de publicar no Vercel.

**Como funciona a autenticacao?**  
O frontend usa Supabase Auth para Google OAuth e sessao. O backend tambem possui rotas de apoio para e-mail/senha.

**O login Google esta integrado de verdade?**  
Sim. O fluxo usa Supabase OAuth e gera URL de autorizacao do Google. Para teste completo, e preciso conta real e Provider Google configurado no Supabase.

**O login com e-mail e senha usa backend ou Supabase?**  
O frontend chama os endpoints do backend restaurado. O backend usa Supabase Auth quando `SUPABASE_ANON_KEY` esta configurada. Em desenvolvimento, sem essa chave, pode usar sessao `dev:`.

**Por que Supabase?**  
Porque oferece autenticacao, OAuth e persistencia com pouca infraestrutura propria.

**Como o backend usa IA?**  
O backend usa Google Gemini para gerar a analise da ideia enviada pelo usuario.

**Como garantiram responsividade?**  
Com CSS responsivo, media queries, sidebar adaptativa e tipografia com `clamp()`.

**O que foi mais dificil tecnicamente?**  
Recuperar autenticacao e backend antigo sem sobrescrever a interface atual e sem quebrar busca, filtros, sidebar e ranking.

**Como resolveram conflitos de merge?**  
Comparando commits antigos, restaurando apenas partes necessarias e validando build/lint/local.

**O que foi recuperado dos commits antigos?**  
Tela de login, servicos de auth, cliente Supabase e backend estruturado com `backend/src`.

**O que foi preservado da branch atual?**  
UI atual, busca, filtros, sidebar responsiva, abas do memorial, ranking/cards, estilos novos e layout mobile.

**O que ainda pode melhorar?**  
Adicionar testes E2E, documentar credenciais de teste, alinhar rota `/health` versus `/api/health` no Render e revisar auditoria de dependencias.

**Como testaram?**  
Com `npm install`, `npm run build`, `npm run lint --workspace=frontend`, servidor local, health do backend, rotas de auth/ideas e teste de URL OAuth Supabase.

**Quais cuidados a equipe precisa ter?**  
Nao alterar `App.jsx`, `AuthScreen`, `authService`, `supabaseClient`, `styles.css`, `Sidebar` ou rotas do backend sem rodar build, lint e testes manuais.

## Checklist De Apresentacao

- app local abre;
- deploy Vercel abre;
- backend Render responde;
- `.env` configurado;
- login Google testado;
- login e-mail/senha testado;
- logout testado;
- busca testada;
- filtros testados;
- sidebar mobile testada;
- abas testadas;
- ranking/cards testados;
- build passando;
- equipe sabe qual repositorio esta conectado ao deploy.

