# Arquitetura, Diagnóstico e Plano Diretor: ieadpg.org

**Documento Oficial de Engenharia & Governança**  
**Data:** 18 de Novembro de 2026  
**Autor:** Orquestrador (Tech Lead & DevOps Lead)  
**Stakeholders & Especialistas:** @Cloudflare, @EmDash, @Github, @Desenvolvedor, @Notificador  

---

## 1. Diagnóstico da Página Atual no Ar (`ieadpg.org`)

Em auditoria técnica realizada na URL pública `https://ieadpg.org`, identificamos o seguinte comportamento operacional:

### 1.1 Redirecionamento e Conflito Canônico
- **Fluxo Atual:** A requisição para `https://ieadpg.org/` retorna um status HTTP `301 Moved Permanently` para `https://amalia.ieadpg.org/` via worker `ieadpg-apex-redirect`.
- **Inconsistência de SEO:** No HTML renderizado em `amalia.ieadpg.org`, a tag canônica aponta para o apex:
  ```html
  <link rel="canonical" href="https://ieadpg.org/">
  <meta property="og:url" content="https://ieadpg.org/">
  ```
  Isso gera um loop de indexação em motores de busca (o Google lê a canônica como `ieadpg.org`, mas ao acessar `ieadpg.org` é redirecionado de volta para `amalia.ieadpg.org`).
- **Resolução Arquitetural:** O domínio principal e canônico deve ser diretamente `https://ieadpg.org`. O subdomínio `amalia.ieadpg.org` e `www.ieadpg.org` devem redirecionar para o apex (ou serem tratados como aliases sem penalização).

### 1.2 Headers HTTP e Segurança de Borda
- **Duplicação de Headers:** A resposta HTTP atual envia cabeçalhos duplicados:
  ```http
  referrer-policy: strict-origin-when-cross-origin
  referrer-policy: strict-origin-when-cross-origin
  x-content-type-options: nosniff
  x-content-type-options: nosniff
  x-frame-options: DENY
  x-frame-options: DENY
  ```
  Isso ocorre devido à sobreposição de regras de transformação gerenciadas na Cloudflare com os cabeçalhos emitidos pelo runtime do Worker.
- **Cabeçalhos Faltantes:**
  - `Strict-Transport-Security` (HSTS com `max-age=31536000; includeSubDomains; preload`).
  - `Content-Security-Policy` (CSP) bem definido para mitigar XSS.
  - `Permissions-Policy` (geolocalização, câmera, microfone).

### 1.3 Entrega de Mídia e Streaming
- O site atual utiliza uma experiência visual interativa de scrubbing/canvas (`scroll-world/scrub-engine.js` e `/scroll-world/am1-a.webp`).
- Para arquivos `.mp4`, foi identificado o script `worker-range.js`, que faz o parse manual do header `Range` e fatia `arrayBuffer` na memória do Worker.
- **Risco Técnico:** Carregar buffers de vídeo em memória no Worker consome o limite de RAM (128 MB no plano gratuito/padrão) e aumenta tempo de CPU.
- **Solução Recomendada:** Offload total de mídias pesadas (`.mp4`, `.webm`, `.jpg` de alta resolução) para o bucket Cloudflare R2 vinculado ao domínio `media.ieadpg.org`, que possui suporte nativo e performático a HTTP Range (206 Partial Content).

---

## 2. Recomendações e Plano para o @Cloudflare

1. **Roteamento Primário do Apex:**
   - Adicionar rota customizada no Cloudflare Workers / Assets para servir `ieadpg.org` diretamente.
   - Configurar Regras de Redirecionamento (Redirect Rules) para:
     - `http://ieadpg.org/*` -> `https://ieadpg.org/*` (HTTP 301)
     - `https://www.ieadpg.org/*` -> `https://ieadpg.org/*` (HTTP 301)
     - `https://amalia.ieadpg.org/*` -> `https://ieadpg.org/*` (HTTP 301)
2. **Deduplicação de Headers de Segurança:**
   - Padronizar via Cloudflare Transform Rules (Modify Response Header) e remover cabeçalhos duplicados emitidos no código da aplicação.
   - Ativar HSTS no painel SSL/TLS da zona `ieadpg.org`.
3. **Cache de Borda & Assets:**
   - Assets estáticos com hash (`/_astro/*`) com `Cache-Control: public, max-age=31536000, immutable`.
   - Páginas HTML com `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=86400`.
   - Ativar Cloudflare Early Hints (`103 Early Hints`) para recursos pré-carregados (`/scroll-world/am1-a.webp`, fontes).
4. **Email Routing & DNS:**
   - Integração das regras de e-mail de entrada (Cloudflare Email Routing) já alinhadas com o @Notificador e Brevo SMTP (SPF/DKIM/DMARC).

---

## 3. Plano de Implantação do CMS com o @EmDash

### 3.1 Arquitetura do CMS
- **Framework:** Astro 5 (modo híbrido com `@astrojs/cloudflare`).
- **CMS:** EmDash CMS integrado às Content Collections do Astro.
- **Estrutura de Conteúdo:**
  - `noticias`: Artigos, devocionais e novidades da igreja.
  - `eventos`: Conferências, retiros, cultos especiais, datas comemorativas com link de inscrição.
  - `ministerios`: Departamentos da igreja (Jovens, Família, Mulheres, Crianças, Louvor, Ensino).
  - `cultos`: Programação semanal (Domingo 19h Celebração, Quarta 20h Alinhamento).
  - `institucional`: Contatos, endereços, redes sociais, chave PIX, versículo do ano.
- **Painel Administrativo:**
  - Interface em `/admin` com autenticação segura.
  - Suporte a preview em tempo real antes de publicação.

### 3.2 Preservação da Identidade Visual
- A experiência rica de canvas/scrubbing (`scroll-world`) será encapsulada em um componente Astro (`src/components/HeroWorld.astro`), mantendo o impacto visual moderno da igreja com fallback semântico e acessível para SEO e leitores de tela.

---

## 4. Governança, Versionamento e CI/CD com o @Github

1. **Repositório Público:**
   - Nome: `ieadpg-amalia/ieadpg.org`
   - Visibilidade: `--public`
   - Regra estrita de Zero Secrets em código e histórico git.
2. **Pipeline de CI/CD (GitHub Actions):**
   - Workflow: `.github/workflows/deploy.yml`
   - Trigger: Push na branch `main` e validação prévia em Pull Requests.
   - Autenticação de Deploy: GitHub Secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
   - Utilização da action oficial `cloudflare/wrangler-action@v3`.
3. **Proteção de Branch & Governança:**
   - Branch `main` protegida (sem commits diretos, merge apenas via PR revisado).
   - Secret Scanning e Dependabot ativados por padrão.

---

## 5. Roteiro de Execução (Roadmap)

| Fase | Etapa | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Fase 1** | Auditoria e diagnóstico da página no ar (`ieadpg.org`) | @Orquestrador | Concluído |
| **Fase 2** | Criação do diretório e arquitetura base do projeto (`shared/ieadpg.org`) | @Orquestrador | Concluído |
| **Fase 3** | Adequações de borda (redirecionamentos, headers, R2, DNS) | @Cloudflare | Em delegação |
| **Fase 4** | Modelagem de schemas e templates no Astro | @EmDash | Em delegação |
| **Fase 5** | Provisionamento do repositório público e pipeline CI/CD | @Github | Em delegação |
| **Fase 6** | Validação, testes de homologação e deploy em produção | Time Integrado | Planejado |
