# ieadpg.org — Website Oficial da IEADPG Jardim Amália

Repositório público oficial do portal institucional da **Igreja Evangélica Assembleia de Deus — Jardim Amália**, em Ponta Grossa/PR.

Operando sob a infraestrutura oficial da Cloudflare via **Cloudflare Workers Assets** e **Edge Streaming**.

---

## 🏛️ Arquitetura e Recursos

- **Experiência Visual Interativa (Scroll-World):**
  - Motor de scrub de alta performance (`scrub-engine.js`).
  - Navegação suave e renderização com suporte a telas retina e dispositivos móveis (coarse pointer / 9:16 portrait).
  - Stills WebP ultra-otimizados e vídeos MP4 codificados especificamente para scrubbing.
- **Backend de Borda (Worker):**
  - Script em `src/worker.js` com suporte completo a **HTTP 206 Partial Content** (header `Range`) para fatiamento de mídia.
  - Entrega ultra-rápida de ativos estáticos via `env.ASSETS` (Cloudflare Workers Assets).
- **Cabeçalhos de Segurança e Cache:**
  - Configurados via `public/_headers` com cache imutável para mídias pesadas (`max-age=31536000, immutable`), segurança contra XSS (`nosniff`, `DENY`) e revalidação instantânea de HTML.

---

## 📁 Estrutura de Diretórios

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD GitHub Actions
├── public/                     # Diretório de ativos estáticos servidos na borda
│   ├── _astro/                 # Estilos CSS e fontes WOFF/WOFF2
│   ├── _headers                # Regras de cache e segurança da Cloudflare
│   ├── scroll-world/           # Clipes MP4, stills WebP e motor scrub-engine.js
│   ├── favicon.ico
│   ├── flame.png / flame.webp
│   ├── icon.png / apple-icon.png
│   ├── ieadpg-logo.png / ieadpg-logo.webp
│   ├── index.html              # Documento HTML principal
│   └── opengraph-image.jpg
├── src/
│   └── worker.js               # Handler do Worker com suporte a HTTP Range
├── package.json
└── wrangler.json               # Contrato de configuração do Cloudflare Workers
```

---

## 🚀 Desenvolvimento Local

Para executar o ambiente localmente:

```bash
# Instalar dependências
npm install

# Iniciar servidor local com Wrangler
npm run dev
```

Acesse `http://localhost:8787` no navegador.

---

## 🚢 CI/CD & Deploy Contínuo

Toda alteração integrada na branch `main` dispara automaticamente o deploy via GitHub Actions para a conta oficial da IEADPG na Cloudflare:

- **Domínio de Produção:** [https://ieadpg.org](https://ieadpg.org)
- **Redirecionamentos Canônicos:** `amalia.ieadpg.org` e `www.ieadpg.org` ➔ `https://ieadpg.org/`
