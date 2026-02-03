# 10dos.com — Plugin website

English landing page for the 10dos minimal todo browser extension. Built with Astro, static output for Cloudflare Pages. Content is managed in Markdown under `src/content/en/` for easy edits and future i18n (e.g. `src/content/zh/`).

SEO: canonical, Open Graph, Twitter Card, JSON-LD (SoftwareApplication), `public/robots.txt`, and static `public/sitemap-index.xml` + `public/sitemap-0.xml`. Replace `public/og-image.svg` with a 1200×630 PNG for production if needed.

## Develop

```bash
cd host
npm install
npm run dev
```

## Build (static)

```bash
npm run build
```

Output: `dist/`

## Deploy to Cloudflare Pages

**Option A — Dashboard**

1. Cloudflare Dashboard → Pages → Create project → Connect to Git.
2. Repo: this repo; branch: `main` (or your branch).
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `host`
4. Save and deploy.

**Option B — Wrangler CLI**

```bash
cd host
npm run build
npx wrangler pages deploy dist --project-name=10dos
```

Ensure `wrangler.toml` has `pages_build_output_dir = "dist"` (already set).
