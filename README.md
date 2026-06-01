# Painel Whatsapp

Aplicacao Next.js para centralizar integracoes de WhatsApp Web e Amazon Alexa.

## Funcionalidades

- Tela inicial em `/integracoes`.
- Fluxo inicial de Login with Amazon para contas Alexa.
- Area dedicada ao WhatsApp Web com abertura segura em nova aba.
- Login opcional com Supabase para controlar acesso ao painel.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variaveis de ambiente

Copie `.env.local.example` para `.env.local` e configure:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/SEU_DEPLOYMENT_ID/exec
NEXT_PUBLIC_AMAZON_LOGIN_CLIENT_ID=amzn1.application-oa2-client.seu_client_id
NEXT_PUBLIC_AMAZON_LOGIN_REDIRECT_URI=https://seu-dominio.com/integracoes/
NEXT_PUBLIC_ALEXA_SKILL_ID=amzn1.ask.skill.seu_skill_id
```

## Observacao sobre WhatsApp Web

O WhatsApp Web bloqueia carregamento dentro de iframes em dominios externos por politica de seguranca do navegador. Por isso, a tela oferece abertura em nova aba. Para automacao oficial de mensagens, use a WhatsApp Business Platform/API.

## Publicacao

O projeto esta configurado para export estatico com Next.js. Para validar antes de publicar:

```bash
npm run lint
npm run build
```
