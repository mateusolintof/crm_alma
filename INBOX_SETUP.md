# 📬 Inbox Unificado - Setup Guide

Este guia explica como configurar o **Inbox Unificado** do Alma CRM para receber e enviar mensagens via WhatsApp, Email e Instagram.

## 🎯 Funcionalidades

✅ Chat em tempo real estilo WhatsApp Web
✅ Suporte multi-canal (WhatsApp, Email, Instagram)
✅ Busca e filtros por canal
✅ Anexar conversas a Deals/Leads
✅ Envio de texto e mídia (imagens, vídeos, documentos)
✅ Auto-criação de contatos
✅ Polling automático (a cada 5 segundos)

---

## 🔧 Configuração Evolution API (WhatsApp)

### 1. **Obter Evolution API**

Você tem 3 opções:

**A) Self-hosted (Docker):**

```bash
git clone https://github.com/EvolutionAPI/evolution-api
cd evolution-api
docker-compose up -d
```

**B) Cloud (recomendado):**

- Acesse: https://evolution-api.com
- Crie uma conta e instância

**C) Provedores terceiros:**

- Muitos providers oferecem Evolution API hospedada

### 2. **Criar Instância WhatsApp**

1. Acesse o painel da Evolution API
2. Crie uma nova instância (ex: `alma-crm`)
3. Gere um QR Code e conecte seu WhatsApp
4. Anote:
   - URL da API (ex: `https://seu-servidor.com/api/v1`)
   - API Key
   - Nome da instância

### 3. **Configurar Variáveis de Ambiente**

Copie `.env.example` para `.env` e preencha:

```bash
# Evolution API Configuration
EVOLUTION_API_URL="https://seu-servidor.com/api/v1"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE_NAME="alma-crm"

# Webhook Security (gere um secret aleatório)
WEBHOOK_API_KEY="use_um_secret_aleatorio_aqui"
```

### 4. **Configurar Webhook na Evolution API**

Configure o webhook para receber mensagens:

**URL do Webhook:**

```
https://seu-dominio.com/api/webhooks/whatsapp
```

**Headers:**

```
x-api-key: seu_webhook_secret_key_aqui
```

**Eventos para escutar:**

- `messages.upsert` (novas mensagens)

**Exemplo via API:**

```bash
curl -X POST https://seu-servidor.com/api/v1/webhook/set/alma-crm \
  -H "Content-Type: application/json" \
  -H "apikey: sua_api_key" \
  -d '{
    "url": "https://seu-dominio.com/api/webhooks/whatsapp",
    "webhook_by_events": true,
    "webhook_base64": false,
    "events": ["messages.upsert"]
  }'
```

---

## 📧 Configuração Email (Futuro)

```bash
# IMAP (receber emails)
EMAIL_IMAP_HOST="imap.gmail.com"
EMAIL_IMAP_PORT="993"
EMAIL_IMAP_USER="seu@email.com"
EMAIL_IMAP_PASSWORD="senha_ou_app_password"

# SMTP (enviar emails)
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_USER="seu@email.com"
EMAIL_SMTP_PASSWORD="senha_ou_app_password"
```

---

## 📸 Configuração Instagram (Futuro)

Instagram requer:

- Meta Business Account
- Instagram Professional Account
- Facebook App configurado

Documentação oficial: https://developers.facebook.com/docs/instagram-api

---

## 🚀 Como Usar

### 1. **Acessar o Inbox**

```
http://localhost:3000/inbox
```

### 2. **Receber Mensagens**

Quando alguém envia mensagem no WhatsApp:

1. Evolution API recebe a mensagem
2. Webhook `POST /api/webhooks/whatsapp` é chamado
3. Contato é criado automaticamente (se não existir)
4. Conversa é criada
5. Mensagem aparece no inbox em até 5 segundos

### 3. **Enviar Mensagens**

1. Selecione uma conversa
2. Digite a mensagem
3. Pressione Enter ou clique em Enviar
4. Mensagem é:
   - Salva no banco
   - Enviada via Evolution API para o WhatsApp
   - Exibida no chat

### 4. **Anexar a um Deal**

1. Clique no ícone de "Link" no header do chat
2. Selecione ou crie um Deal
3. Todas as mensagens futuras ficarão vinculadas

---

## 🧪 Testando

### 1. **Teste o Webhook**

```bash
curl https://seu-dominio.com/api/webhooks/whatsapp
```

Deve retornar:

```json
{
  "status": "ok",
  "message": "WhatsApp webhook endpoint is active"
}
```

### 2. **Envie uma mensagem de teste**

Envie uma mensagem via WhatsApp para o número conectado. Ela deve aparecer no inbox em até 5 segundos.

### 3. **Responda via CRM**

Responda a mensagem pelo inbox. A resposta deve chegar no WhatsApp do contato.

---

## 🔍 Troubleshooting

### Mensagens não chegam no inbox:

1. **Verifique se o webhook está ativo:**

   ```bash
   curl https://seu-servidor-evolution.com/api/v1/webhook/find/alma-crm \
     -H "apikey: sua_api_key"
   ```

2. **Verifique logs do servidor:**

   ```bash
   # Logs do Next.js
   npm run dev

   # Ou logs de produção
   pm2 logs
   ```

3. **Teste o webhook manualmente:**
   ```bash
   curl -X POST https://seu-dominio.com/api/webhooks/whatsapp \
     -H "Content-Type: application/json" \
     -H "x-api-key: seu_webhook_secret" \
     -d '{
       "event": "messages.upsert",
       "data": {
         "key": {
           "remoteJid": "5511999999999@s.whatsapp.net",
           "fromMe": false,
           "id": "test123"
         },
         "pushName": "Teste",
         "message": {
           "conversation": "Mensagem de teste"
         },
         "messageTimestamp": 1234567890
       }
     }'
   ```

### Mensagens enviadas não chegam no WhatsApp:

1. **Verifique status da instância:**

   ```bash
   curl https://seu-servidor-evolution.com/api/v1/instance/connectionState/alma-crm \
     -H "apikey: sua_api_key"
   ```

2. **Verifique se a API Key está correta no `.env`**

3. **Veja logs do console no navegador (F12)**

---

## 📊 Próximos Passos

- [ ] Implementar upload de mídias (imagens, PDFs)
- [ ] Adicionar suporte a Email (IMAP/SMTP)
- [ ] Adicionar suporte a Instagram DM
- [ ] Implementar WebSocket para real-time (remover polling)
- [ ] Adicionar notificações desktop
- [ ] Criar templates de respostas rápidas
- [ ] Adicionar chatbot/automação

---

## 📚 Referências

- **Evolution API Docs:** https://doc.evolution-api.com/
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Prisma Docs:** https://www.prisma.io/docs

---

**Criado por:** Alma CRM
**Atualizado em:** 2025-01-21
