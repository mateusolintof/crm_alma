# ROADMAP.md - Melhorias e Implementações Futuras

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Prioridades Críticas](#prioridades-críticas-p0)
3. [Melhorias de Curto Prazo](#melhorias-de-curto-prazo-p1)
4. [Features de Médio Prazo](#features-de-médio-prazo-p2)
5. [Visão de Longo Prazo](#visão-de-longo-prazo-p3)
6. [Otimizações Técnicas](#otimizações-técnicas)
7. [Integrações Futuras](#integrações-futuras)
8. [UX/UI Improvements](#uxui-improvements)

---

## Visão Geral

Este documento mapeia todas as melhorias, correções e features planejadas para o Alma CRM, organizadas por prioridade e complexidade.

**Legenda de Prioridades**:
- **P0 (Crítico)**: Essencial para produção, bugs críticos, segurança
- **P1 (Alto)**: Features core importantes, melhorias significativas
- **P2 (Médio)**: Nice to have, features secundárias
- **P3 (Baixo)**: Ideias futuras, experimentos

**Estimativas de Esforço**:
- **XS**: < 1 dia
- **S**: 1-3 dias
- **M**: 1 semana
- **L**: 2-4 semanas
- **XL**: 1-3 meses

---

## Prioridades Críticas (P0)

### 🔒 Segurança e Autenticação

#### 1. Implementar Session Management Real
**Problema**: Atualmente o tenant é hardcoded como "alma.agency"

**Solução**:
- [ ] Extrair tenantId do JWT payload
- [ ] Criar hook `useTenant()` para componentes client
- [ ] Passar tenant via context API
- [ ] Atualizar todos os endpoints para usar tenant da sessão

**Esforço**: M
**Impacto**: Crítico para multi-tenancy funcional

#### 2. CSRF Protection
**Problema**: Endpoints POST/PATCH/DELETE não têm proteção CSRF

**Solução**:
- [ ] Implementar tokens CSRF (usar `src/lib/csrf.ts`)
- [ ] Adicionar middleware de validação
- [ ] Incluir token em formulários

**Esforço**: S
**Impacto**: Segurança essencial

#### 3. Rate Limiting
**Problema**: API sem proteção contra abuse

**Solução**:
- [ ] Implementar rate limiting por IP
- [ ] Rate limiting por tenant
- [ ] Rate limiting em endpoints sensíveis (login, webhooks)
- [ ] Usar Upstash Redis ou Vercel KV

**Esforço**: M
**Impacto**: Segurança e performance

#### 4. Variáveis de Ambiente Seguras
**Problema**: `.env.example` contém credenciais reais

**Solução**:
- [ ] Limpar `.env.example` (usar placeholders)
- [ ] Adicionar validação de env vars (zod)
- [ ] Documentar variáveis obrigatórias

**Esforço**: XS
**Impacto**: Segurança crítica

---

### 🐛 Bugs e Correções

#### 5. Webhook Security Headers
**Problema**: Webhook WhatsApp valida API key mas aceita qualquer origin

**Solução**:
- [ ] Validar origin do request
- [ ] Implementar signature verification (HMAC)
- [ ] Rate limiting específico para webhooks

**Esforço**: S
**Impacto**: Segurança crítica

#### 6. Error Handling Padronizado
**Problema**: Erros inconsistentes entre endpoints

**Solução**:
- [ ] Criar error handler centralizado
- [ ] Padronizar responses de erro
- [ ] Logging estruturado (Sentry, LogRocket)
- [ ] Error boundaries no frontend

**Esforço**: M
**Impacto**: Developer experience e debugging

#### 7. Validação de Input
**Problema**: Endpoints não validam payloads recebidos

**Solução**:
- [ ] Implementar Zod schemas para todos os endpoints
- [ ] Validar query params, body, headers
- [ ] Retornar erros de validação claros

**Esforço**: M
**Impacto**: Segurança e UX

---

## Melhorias de Curto Prazo (P1)

### ✨ Features Core

#### 8. CRUD Completo para Contatos
**Funcionalidade Atual**: Apenas GET

**Implementar**:
- [ ] POST `/api/contacts` - Criar contato
- [ ] PATCH `/api/contacts/:id` - Atualizar contato
- [ ] DELETE `/api/contacts/:id` - Deletar contato
- [ ] Formulário de criação/edição no frontend
- [ ] Modal de detalhes do contato

**Esforço**: S
**Impacto**: Feature essencial

#### 9. CRUD Completo para Empresas
**Funcionalidade Atual**: Apenas GET

**Implementar**:
- [ ] POST `/api/companies` - Criar empresa
- [ ] PATCH `/api/companies/:id` - Atualizar empresa
- [ ] DELETE `/api/companies/:id` - Deletar empresa
- [ ] Formulário de criação/edição
- [ ] Upload de logo da empresa

**Esforço**: S
**Impacto**: Feature essencial

#### 10. CRUD Completo para Leads
**Funcionalidade Atual**: Apenas GET

**Implementar**:
- [ ] POST `/api/leads` - Criar lead
- [ ] PATCH `/api/leads/:id` - Atualizar lead
- [ ] DELETE `/api/leads/:id` - Deletar lead
- [ ] Lead scoring automático (algoritmo)
- [ ] Conversão de lead para deal

**Esforço**: M
**Impacto**: Feature crítica de vendas

#### 11. Criar Negócio (Deal) pelo Frontend
**Problema**: Botão "Novo Negócio" não funciona

**Implementar**:
- [ ] POST `/api/deals` - Criar deal
- [ ] Modal de criação de deal
- [ ] Campos: título, MRR, empresa, contato, stage
- [ ] Auto-link com lead de origem
- [ ] Validações de campos obrigatórios

**Esforço**: M
**Impacto**: Feature core do pipeline

#### 12. Detalhes do Deal (Visualização/Edição)
**Implementar**:
- [ ] Modal/página de detalhes do deal
- [ ] Edição inline de campos
- [ ] Histórico de mudanças de stage
- [ ] Timeline de atividades
- [ ] Anexos e notas

**Esforço**: L
**Impacto**: UX crítica

---

### 💬 Inbox Unificado

#### 13. Upload de Mídia (Imagens, PDFs, etc.)
**Funcionalidade Atual**: Apenas texto

**Implementar**:
- [ ] Upload de imagens/documentos
- [ ] Preview de imagens no chat
- [ ] Supabase Storage ou S3 para armazenamento
- [ ] Envio de mídia via Evolution API
- [ ] Compressão de imagens

**Esforço**: M
**Impacto**: UX essencial

#### 14. Integração Email
**Implementar**:
- [ ] Conectar Gmail/Outlook via OAuth
- [ ] Receber emails via IMAP/webhook
- [ ] Enviar emails via SMTP
- [ ] Parser de threads de email
- [ ] Exibir emails no inbox unificado

**Esforço**: L
**Impacto**: Diferencial competitivo

#### 15. Integração SMS
**Implementar**:
- [ ] Integração com Twilio/Vonage
- [ ] Envio de SMS pelo inbox
- [ ] Recepção via webhook
- [ ] Templates de SMS

**Esforço**: M
**Impacto**: Nice to have

#### 16. Notificações Desktop
**Implementar**:
- [ ] Web Push Notifications API
- [ ] Notificar nova mensagem
- [ ] Notificar menções (@usuario)
- [ ] Configurações de notificação por usuário

**Esforço**: S
**Impacto**: UX importante

#### 17. Real-time com WebSockets
**Problema**: Polling de 5s não é eficiente

**Implementar**:
- [ ] Substituir polling por WebSockets (Socket.io ou Pusher)
- [ ] Broadcast de novas mensagens
- [ ] Indicador "fulano está digitando..."
- [ ] Status online/offline de agentes

**Esforço**: L
**Impacto**: Performance e UX

#### 18. Busca Avançada no Inbox
**Implementar**:
- [ ] Busca full-text em mensagens
- [ ] Filtros: data, canal, status
- [ ] Busca por remetente
- [ ] Busca por conteúdo de mídia (OCR futuro)

**Esforço**: M
**Impacto**: UX importante

---

### 🎯 Pipeline e Vendas

#### 19. Atividades e Follow-ups
**Implementar**:
- [ ] CRUD de atividades (tasks)
- [ ] Tipos: call, email, meeting, task
- [ ] Due dates e reminders
- [ ] Notificações de atividades vencidas
- [ ] Calendário de atividades

**Esforço**: L
**Impacto**: Feature core de CRM

#### 20. Automações de Pipeline
**Implementar**:
- [ ] Triggers automáticos (ex: deal em stage X por 7 dias)
- [ ] Ações: enviar email, criar task, notificar
- [ ] Builder visual de automações
- [ ] Templates de automação por pipeline

**Esforço**: XL
**Impacto**: Diferencial competitivo

#### 21. Relatórios e Dashboards
**Implementar**:
- [ ] Dashboard com KPIs: MRR, conversion rate, pipeline velocity
- [ ] Gráficos de funil de vendas
- [ ] Relatório por vendedor
- [ ] Forecast de receita
- [ ] Exportação para Excel/PDF

**Esforço**: L
**Impacto**: Feature crítica para gestores

#### 22. Probabilidade de Fechamento (AI)
**Implementar**:
- [ ] Modelo de ML para prever % de fechamento
- [ ] Features: histórico de deals, stage time, interações
- [ ] Score de saúde do deal
- [ ] Alertas para deals em risco

**Esforço**: XL
**Impacto**: Inovação competitiva

---

## Features de Médio Prazo (P2)

### 🧠 Inteligência Artificial

#### 23. AI Assistant para Qualificação
**Implementar**:
- [ ] Chatbot para pré-qualificar leads
- [ ] Integração com OpenAI/Anthropic
- [ ] Sugestões de respostas no inbox
- [ ] Auto-fill de campos do deal baseado em conversa
- [ ] Sentiment analysis de mensagens

**Esforço**: XL
**Impacto**: Inovação high-value

#### 24. Transcrição de Chamadas
**Implementar**:
- [ ] Integração com Twilio/Vonage para gravação
- [ ] Whisper API para transcrição
- [ ] Análise de sentimento e keywords
- [ ] Resumo automático da chamada

**Esforço**: L
**Impacto**: Nice to have premium

---

### 👥 Colaboração e Equipes

#### 25. Menções e Comentários
**Implementar**:
- [ ] @mentions em conversas/deals
- [ ] Sistema de comentários internos
- [ ] Notificações de menções
- [ ] Thread de discussão por deal

**Esforço**: M
**Impacto**: Colaboração de time

#### 26. Permissões Granulares (RBAC)
**Funcionalidade Atual**: Role simples (SALES_REP)

**Implementar**:
- [ ] Sistema de permissões detalhado
- [ ] Roles: Admin, Manager, Sales Rep, CS, Viewer
- [ ] Permissões por módulo (contacts, deals, settings)
- [ ] Visibilidade de dados por equipe

**Esforço**: L
**Impacto**: Feature enterprise

#### 27. Audit Log Completo
**Implementar**:
- [ ] Logging de todas as ações
- [ ] Filtros: usuário, ação, entidade, data
- [ ] Revert de ações (soft delete)
- [ ] Compliance (LGPD/GDPR)

**Esforço**: M
**Impacto**: Compliance e segurança

---

### 📱 Mobile

#### 28. Progressive Web App (PWA)
**Implementar**:
- [ ] Service worker para offline
- [ ] App manifest
- [ ] Instalável no mobile
- [ ] Push notifications
- [ ] Sync em background

**Esforço**: M
**Impacto**: Acessibilidade mobile

#### 29. App Nativo (React Native)
**Implementar**:
- [ ] App iOS e Android
- [ ] Inbox nativo
- [ ] Notificações push nativas
- [ ] Biometria para login
- [ ] Upload de fotos/documentos

**Esforço**: XL
**Impacto**: Competitivo para mercado mobile-first

---

### 🎨 Customização e Branding

#### 30. White-label Completo
**Funcionalidade Atual**: Branding básico no Tenant

**Implementar**:
- [ ] Upload de logo por tenant
- [ ] Customização de cores primárias
- [ ] CSS customizado por tenant
- [ ] Domínio customizado (tenant.seudominio.com)
- [ ] Email templates brandados

**Esforço**: L
**Impacto**: Feature SaaS enterprise

#### 31. Temas Dark/Light
**Implementar**:
- [ ] Toggle dark mode
- [ ] Persistência de preferência
- [ ] Paleta dark mode completa
- [ ] Auto-detecção de sistema

**Esforço**: M
**Impacto**: UX modern standard

---

### 📊 Pós-Vendas e CS

#### 32. Gestão de Contratos Completa
**Funcionalidade Atual**: Model existe mas sem UI

**Implementar**:
- [ ] CRUD de contratos
- [ ] Renovações automáticas
- [ ] Alertas de vencimento
- [ ] Templates de contrato
- [ ] Assinatura eletrônica (DocuSign)

**Esforço**: L
**Impacto**: Feature pós-vendas

#### 33. Health Score de Clientes
**Implementar**:
- [ ] Score automático (interações, NPS, pagamentos)
- [ ] Dashboard de health
- [ ] Alertas de churn risk
- [ ] Playbooks de recuperação

**Esforço**: L
**Impacto**: Customer Success

#### 34. NPS e Pesquisas
**Implementar**:
- [ ] Envio de NPS automático
- [ ] CSAT após fechamento de ticket
- [ ] Pesquisas customizadas
- [ ] Dashboard de satisfação

**Esforço**: M
**Impacto**: Customer feedback

---

## Visão de Longo Prazo (P3)

### 🌐 Integrações Avançadas

#### 35. Marketplace de Integrações
**Implementar**:
- [ ] Zapier integration
- [ ] Make.com integration
- [ ] API pública documentada (Swagger)
- [ ] Webhooks configuráveis
- [ ] SDK JavaScript/Python

**Esforço**: XL
**Impacto**: Ecossistema

#### 36. Integrações Nativas
**Implementar**:
- [ ] Slack (notificações, comandos)
- [ ] Google Calendar (reuniões)
- [ ] Zoom/Meet (call tracking)
- [ ] LinkedIn (import de contatos)
- [ ] Instagram Direct (inbox)
- [ ] Telegram (inbox)
- [ ] RD Station (marketing)
- [ ] HubSpot (migração de dados)

**Esforço**: XL (incremental)
**Impacto**: Feature competitiva

---

### 🔬 Experimentos e Inovações

#### 37. Voice Assistant
**Implementar**:
- [ ] Comando de voz para criar deals
- [ ] Ditado de notas
- [ ] Integração com Alexa/Google Home

**Esforço**: XL
**Impacto**: Inovação experimental

#### 38. Gamificação para Vendas
**Implementar**:
- [ ] Leaderboard de vendedores
- [ ] Badges e achievements
- [ ] Metas e challenges
- [ ] Prêmios e incentivos

**Esforço**: L
**Impacto**: Engajamento de equipe

#### 39. Predictive Analytics
**Implementar**:
- [ ] Previsão de churn
- [ ] Melhor momento para contato
- [ ] Lifetime value prediction
- [ ] Upsell opportunities

**Esforço**: XL
**Impacto**: AI premium feature

---

## Otimizações Técnicas

### ⚡ Performance

#### 40. Pagination e Infinite Scroll
**Problema**: Listas carregam todos os itens

**Implementar**:
- [ ] Pagination server-side
- [ ] Infinite scroll no frontend
- [ ] Virtual scrolling para listas grandes
- [ ] Lazy loading de relações Prisma

**Esforço**: M
**Impacto**: Performance crítica

#### 41. Caching Estratégico
**Implementar**:
- [ ] Redis para cache de queries frequentes
- [ ] React Query/SWR para cache client-side
- [ ] Cache de conversas no inbox
- [ ] Stale-while-revalidate pattern

**Esforço**: M
**Impacto**: Performance e UX

#### 42. Database Indexing
**Problema**: Queries podem ficar lentas com volume

**Implementar**:
- [ ] Analisar slow queries (pgAnalyze)
- [ ] Adicionar indexes otimizados
- [ ] Composite indexes para filtros comuns
- [ ] Partial indexes onde aplicável

**Esforço**: S
**Impacto**: Performance crítica em escala

#### 43. Image Optimization
**Implementar**:
- [ ] next/image para todas as imagens
- [ ] Compressão automática (Sharp)
- [ ] WebP/AVIF format
- [ ] CDN para assets (Cloudflare, Vercel)

**Esforço**: S
**Impacto**: Performance e SEO

#### 44. Code Splitting Avançado
**Implementar**:
- [ ] Dynamic imports para rotas pesadas
- [ ] Lazy load de componentes grandes
- [ ] Chunk optimization
- [ ] Bundle analyzer para monitorar tamanho

**Esforço**: M
**Impacto**: Performance de carregamento

---

### 🧪 Testing

#### 45. Testes Unitários
**Implementar**:
- [ ] Jest + React Testing Library
- [ ] Testes de componentes críticos
- [ ] Testes de utils e helpers
- [ ] Coverage mínimo de 70%

**Esforço**: L
**Impacto**: Qualidade de código

#### 46. Testes de Integração
**Implementar**:
- [ ] Testes de API endpoints
- [ ] Testes de fluxos completos
- [ ] Mock de Prisma
- [ ] CI/CD integration

**Esforço**: L
**Impacto**: Confiabilidade

#### 47. E2E Testing
**Implementar**:
- [ ] Playwright para testes E2E
- [ ] Testes de fluxos críticos (login, criar deal, enviar mensagem)
- [ ] Visual regression testing
- [ ] Smoke tests em produção

**Esforço**: L
**Impacto**: QA automation

---

### 🔍 Observability

#### 48. Logging Estruturado
**Implementar**:
- [ ] Winston ou Pino para logs
- [ ] Log levels (debug, info, warn, error)
- [ ] Structured logging (JSON)
- [ ] Correlação de requests (trace ID)

**Esforço**: M
**Impacto**: Debugging e monitoring

#### 49. Error Tracking
**Implementar**:
- [ ] Sentry para error tracking
- [ ] Source maps para stack traces
- [ ] User context em errors
- [ ] Alertas de errors críticos

**Esforço**: S
**Impacto**: Reliability

#### 50. Monitoring e Métricas
**Implementar**:
- [ ] APM (Datadog, New Relic, ou Vercel Analytics)
- [ ] Métricas de performance (Core Web Vitals)
- [ ] Uptime monitoring (Pingdom)
- [ ] Database performance metrics

**Esforço**: M
**Impacto**: SRE e reliability

---

### 🏗️ Arquitetura

#### 51. Microservices (Futuro)
**Quando o monolito ficar grande**:
- [ ] Separar inbox em serviço próprio
- [ ] Separar pipeline em serviço próprio
- [ ] Message queue (RabbitMQ, AWS SQS)
- [ ] API Gateway

**Esforço**: XL
**Impacto**: Escalabilidade enterprise

#### 52. Event Sourcing
**Para auditoria avançada**:
- [ ] Event store (Kafka, EventStoreDB)
- [ ] CQRS pattern
- [ ] Replay de eventos
- [ ] Time-travel debugging

**Esforço**: XL
**Impacto**: Arquitetura avançada

---

## Integrações Futuras

### 📞 Telefonia

- [ ] Twilio Voice
- [ ] Vonage
- [ ] Call recording
- [ ] IVR (URA)
- [ ] Call analytics

**Esforço**: L
**Impacto**: Feature premium

### 📧 Email Marketing

- [ ] Integração com SendGrid/Mailgun
- [ ] Campanhas de email
- [ ] Tracking de opens/clicks
- [ ] A/B testing de emails
- [ ] Templates de email

**Esforço**: L
**Impacto**: Marketing automation

### 💳 Pagamentos

- [ ] Stripe integration
- [ ] Asaas integration (Brasil)
- [ ] Tracking de pagamentos de contratos
- [ ] Cobrança recorrente
- [ ] Dunning management

**Esforço**: L
**Impacto**: Fintech feature

---

## UX/UI Improvements

### 🎨 Design

#### 53. Onboarding Interativo
**Implementar**:
- [ ] Tour guiado para novos usuários
- [ ] Tooltips contextuais
- [ ] Checklist de setup
- [ ] Video tutorials

**Esforço**: M
**Impacto**: User adoption

#### 54. Atalhos de Teclado
**Implementar**:
- [ ] Cmd+K para busca global
- [ ] Atalhos para criar deal, contato, etc.
- [ ] Navegação por teclado no inbox
- [ ] Hotkeys personalizáveis

**Esforço**: M
**Impacto**: Power users

#### 55. Drag-and-Drop Universal
**Implementar**:
- [ ] Arrastar contato para criar deal
- [ ] Arrastar arquivo para upload
- [ ] Arrastar mensagem para criar task
- [ ] Reordenar campos customizados

**Esforço**: M
**Impacto**: UX fluida

#### 56. Pesquisa Global (Cmd+K)
**Implementar**:
- [ ] Busca universal em todo o CRM
- [ ] Buscar contatos, empresas, deals, mensagens
- [ ] Navegação rápida
- [ ] Recent searches

**Esforço**: M
**Impacto**: Productivity

#### 57. Templates e Snippets
**Implementar**:
- [ ] Templates de mensagens
- [ ] Snippets de respostas rápidas
- [ ] Variáveis dinâmicas (nome do contato, empresa)
- [ ] Compartilhar templates com time

**Esforço**: M
**Impacto**: Efficiency

---

## Priorização Sugerida (Next 6 Months)

### Sprint 1-2 (Crítico)
1. Session management real (tenant da sessão)
2. Validação de input com Zod
3. CSRF protection
4. Limpar .env.example

### Sprint 3-4 (Core Features)
5. CRUD completo: Contatos, Empresas, Leads
6. Criar deal pelo frontend
7. Detalhes do deal (modal)
8. Upload de mídia no inbox

### Sprint 5-6 (UX)
9. Notificações desktop
10. Busca avançada no inbox
11. Atividades e follow-ups
12. Pagination nas listas

### Sprint 7-8 (Advanced)
13. Real-time com WebSockets
14. Integração Email
15. Relatórios básicos
16. Rate limiting

---

## Métricas de Sucesso

Para cada feature implementada, definir:

- **Adoption Rate**: % de usuários que usam a feature
- **Usage Frequency**: Quantas vezes por dia/semana
- **Impact on KPIs**: Efeito em conversion rate, churn, etc.
- **User Satisfaction**: NPS/CSAT após uso

---

## Como Contribuir com o Roadmap

1. Abra uma issue no GitHub descrevendo a feature
2. Adicione label: `feature-request`
3. Descreva: problema, solução proposta, impacto esperado
4. Aguarde discussão e priorização

---

**Última atualização**: 2025-01-20
**Mantido por**: Alma Agency Product Team
