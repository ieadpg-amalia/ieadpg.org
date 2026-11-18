# IEADPG.org · Portal Institucional & CMS

Repositório público do website institucional e CMS da **IEADPG Jardim Amália** (Igreja Evangélica Assembleia de Deus em Ponta Grossa/PR).

- **Stack:** [Astro](https://astro.build/) (v5 Hybrid) + [EmDash CMS](https://emdash.dev) + [Cloudflare Workers / Assets](https://developers.cloudflare.com/workers/)
- **Hospedagem & Edge:** Cloudflare Global Network
- **Repositório GitHub:** `ieadpg-amalia/ieadpg.org` (Público)

---

## 📁 Estrutura do Projeto

```text
ieadpg.org/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD GitHub Actions -> Cloudflare
├── public/                     # Favicons, robots.txt, assets estáticos locais
├── src/
│   ├── components/             # Componentes Astro reutilizáveis
│   ├── content/                # Content Collections do Astro / Schemas do CMS
│   │   └── config.ts           # Definição de schemas: notícias, eventos, cultos, etc.
│   ├── layouts/                # Layouts base HTML e SEO
│   └── pages/                  # Rotas e páginas do site
├── astro.config.mjs            # Configuração Astro com adaptador Cloudflare
├── tsconfig.json               # Configuração TypeScript estrita
├── wrangler.json               # Configuração de deploy do Cloudflare Workers / Assets
└── ARCHITECTURE.md             # Documento de Arquitetura, Diagnóstico e Governança
```

---

## 🔒 Diretrizes de Segurança (Repositório Público)

1. **Zero Secrets:** Nunca commite credenciais, senhas, tokens ou arquivos `.env` / `.dev.vars`.
2. **Secrets no CI/CD:** Apenas GitHub Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) são injetados durante o workflow.
3. **Mídias Pesadas:** Mídias volumosas e vídeos MP4 devem ser hospedados no Cloudflare R2 (`https://media.ieadpg.org`).

---

## 🚀 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Checagem de tipos
npm run typecheck

# Build de produção
npm run build

# Deploy manual (necessita login no wrangler)
npm run deploy
```
