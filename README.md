# IEADPG Jardim Amália - Site Institucional

Site institucional da **IEADPG Jardim Amália**, construído em [Astro](https://astro.build/) e servido globalmente na borda da Cloudflare com [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/static-assets/).

## Arquitetura & Stack Tecnológica
- **Framework**: Astro 5 (Static Site Generation / Assets)
- **Edge Layer**: Cloudflare Workers com suporte a HTTP Range (status 206) para streaming de vídeo MP4
- **Domínios**: `amalia.ieadpg.org`, `ieadpg.com`, `www.ieadpg.com`
- **CI/CD**: GitHub Actions com `cloudflare/wrangler-action`

## Desenvolvimento Local
```bash
npm install
npm run dev
```

## Build & Deploy
```bash
npm run build
npm run deploy
```
