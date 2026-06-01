'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

type AmazonCallback = {
  code: string | null
  state: string | null
  error: string | null
  errorDescription: string | null
}

const amazonClientId = process.env.NEXT_PUBLIC_AMAZON_LOGIN_CLIENT_ID || ''
const configuredRedirectUri = process.env.NEXT_PUBLIC_AMAZON_LOGIN_REDIRECT_URI || ''
const alexaSkillId = process.env.NEXT_PUBLIC_ALEXA_SKILL_ID || ''
const whatsappWebUrl = 'https://web.whatsapp.com/'

function randomState() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2)
}

export default function IntegracoesPage() {
  const [callback] = useState<AmazonCallback>(() => {
    if (typeof window === 'undefined') {
      return { code: null, state: null, error: null, errorDescription: null }
    }

    const params = new URLSearchParams(window.location.search)
    return {
      code: params.get('code'),
      state: params.get('state'),
      error: params.get('error'),
      errorDescription: params.get('error_description'),
    }
  })

  const amazonReady = Boolean(amazonClientId)

  function iniciarLoginAmazon() {
    if (!amazonReady) return

    const state = randomState()
    localStorage.setItem('amazon_oauth_state', state)
    const currentPageUrl = window.location.href.split('?')[0].split('#')[0]
    const redirectUri = configuredRedirectUri || currentPageUrl

    const params = new URLSearchParams({
      client_id: amazonClientId,
      scope: 'profile',
      response_type: 'code',
      redirect_uri: redirectUri,
      state,
    })

    window.location.href = `https://www.amazon.com/ap/oa?${params.toString()}`
  }

  function abrirWhatsAppWeb() {
    window.open(whatsappWebUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="app-shell integrations-shell">
      <aside className="app-sidebar" style={{ width: 230, background: 'rgba(0,0,0,0.4)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <div className="sidebar-brand" style={{ marginBottom: 20, padding: '0 8px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f0e6ff' }}>Painel</div>
          <div style={{ fontSize: 11, color: 'rgba(240,230,255,0.4)', marginTop: 4 }}>Integracoes</div>
        </div>
        <div className="nav-link active">Integracoes</div>
        <Link href="/login" style={{ textDecoration: 'none', marginTop: 'auto' }}><div className="nav-link">Sair</div></Link>
      </aside>

      <main className="app-main integrations-main">
        <div className="page-header integrations-header">
          <div>
            <p className="integrations-eyebrow">Amazon Alexa + WhatsApp Web</p>
            <h1><span className="gradient-text">Central de Integracoes</span></h1>
            <p>Conecte contas Amazon/Alexa e acesse o WhatsApp Web por um fluxo seguro.</p>
          </div>
          <div className="integration-status-pill">Configuracao inicial</div>
        </div>

        <section className="integrations-grid">
          <article className="glass integration-card">
            <div className="integration-card-header">
              <div>
                <span className="integration-label">Login with Amazon</span>
                <h2>Contas Alexa</h2>
              </div>
              <span className={amazonReady ? 'integration-badge ready' : 'integration-badge pending'}>
                {amazonReady ? 'Pronto para testar' : 'Aguardando Client ID'}
              </span>
            </div>

            <p>
              Este botao inicia o OAuth da Amazon. Depois que a Amazon retornar o codigo de autorizacao,
              a proxima etapa e trocar esse codigo por tokens em um backend seguro.
            </p>

            <div className="integration-config-list">
              <div>
                <span>Client ID</span>
                <strong>{amazonClientId ? 'Configurado' : 'Definir NEXT_PUBLIC_AMAZON_LOGIN_CLIENT_ID'}</strong>
              </div>
              <div>
                <span>Redirect URI</span>
                <strong>{configuredRedirectUri || 'A URL atual /integracoes sera usada no navegador'}</strong>
              </div>
              <div>
                <span>Alexa Skill</span>
                <strong>{alexaSkillId || 'Opcional: NEXT_PUBLIC_ALEXA_SKILL_ID'}</strong>
              </div>
            </div>

            {callback.error && (
              <div className="integration-alert error">
                A Amazon retornou erro: {callback.errorDescription || callback.error}
              </div>
            )}

            {callback.code && (
              <div className="integration-alert success">
                Codigo Amazon recebido. Estado: {callback.state || 'sem state'}. Agora falta a troca segura por token no servidor.
              </div>
            )}

            <button type="button" className="btn-primary integration-action" disabled={!amazonReady} onClick={iniciarLoginAmazon}>
              Entrar com Amazon
            </button>

            <a className="integration-secondary-link" href="https://developer.amazon.com/alexa/console/ask" target="_blank" rel="noreferrer">
              Abrir console Alexa Developer
            </a>
          </article>

          <article className="glass integration-card whatsapp-card">
            <div className="integration-card-header">
              <div>
                <span className="integration-label">WhatsApp Web</span>
                <h2>Operacao com QR Code</h2>
              </div>
              <span className="integration-badge ready">QR Code ativo</span>
            </div>

            <p>
              O WhatsApp Web nao permite ser carregado dentro de outro site. Por isso, removi a tela bloqueada
              e deixei o caminho correto: abrir o WhatsApp Web oficial e escanear o QR exibido por ele.
            </p>

            <div className="whatsapp-qr-panel whatsapp-qr-panel-large">
              <div className="whatsapp-qr-box" aria-label="QR Code para abrir WhatsApp Web">
                <QRCodeSVG
                  value={whatsappWebUrl}
                  size={224}
                  bgColor="#ffffff"
                  fgColor="#0d0814"
                  marginSize={2}
                />
              </div>
              <div>
                <strong>QR Code habilitado</strong>
                <span>
                  Escaneie para abrir o WhatsApp Web. Para conectar a conta, abra WhatsApp no celular,
                  entre em Aparelhos conectados e escaneie o QR oficial exibido na aba do WhatsApp Web.
                </span>
              </div>
            </div>

            <div className="whatsapp-toolbar">
              <button type="button" className="btn-primary integration-action" onClick={abrirWhatsAppWeb}>
                Abrir WhatsApp Web
              </button>
            </div>
          </article>
        </section>

        <section className="glass-sm integration-notes">
          <h2>Proximas etapas tecnicas</h2>
          <div className="integration-steps">
            <div>
              <strong>1. Registrar Login with Amazon</strong>
              <span>Criar o Security Profile na Amazon e cadastrar a Redirect URI desta pagina.</span>
            </div>
            <div>
              <strong>2. Criar backend de tokens</strong>
              <span>Trocar o authorization code por access token/refresh token fora do navegador.</span>
            </div>
            <div>
              <strong>3. Vincular Alexa Skill</strong>
              <span>Configurar Account Linking na skill para associar a conta Alexa a conta interna.</span>
            </div>
            <div>
              <strong>4. WhatsApp oficial</strong>
              <span>Para automacao real, usar WhatsApp Business Platform/API em vez de controlar WhatsApp Web embutido.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
