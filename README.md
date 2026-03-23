# React Router + Uniform CMS Starter

A starter template for React Router v7 built on Uniform CMS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **React Router v7** with SSR and file-based routing
- **Uniform Canvas** visual editor using Uniform Canvas
- **Uniform Context** personalization and A/B testing using Uniform Context
- **Geo personalization** — Vercel edge headers (`x-vercel-ip-country` / region / city) are exposed as Uniform quirks (`vc-country`, `vc-region`, `vc-city`) so `<Personalize>` can select geo-targeted variants server-side on the very first request, including with JavaScript disabled
- **Tailwind CSS v4** for styling

## Quick Start

### Prerequisites

- Node.js 18+
- Uniform CMS account ([sign up free](https://uniform.app))

### Installation

```bash
git clone https://github.com/robertvdboorn/react-router-uniform.git
cd react-router-uniform
npm install
cp env.example .env
# Edit .env with your Uniform credentials
npm run uniform:manifest
npm run dev
```

Visit http://localhost:3411

## Configuration

Create a `.env` file:

```bash
# Required
UNIFORM_API_KEY=uf_your_api_key_here
UNIFORM_PROJECT_ID=your_project_id_here
UNIFORM_PREVIEW_SECRET=your_secure_random_string

# Optional (recommended for production)
UPSTASH_REDIS_REST_URL=https://your-redis-xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
ENABLE_CSP=true

# Optional — simulate Vercel geo headers locally for testing geo personalization
# On a real Vercel deployment these are injected automatically by the edge network
UNIFORM_DEV_GEO_COUNTRY=FI
UNIFORM_DEV_GEO_REGION=FI-18
UNIFORM_DEV_GEO_CITY=Helsinki
```

### Getting Uniform Credentials

1. Sign up at [uniform.app](https://uniform.app)
2. Go to Settings → API Keys → Create new key
3. Click "Copy as .env" for quick setup
4. Generate preview secret: `openssl rand -base64 32`

### Optional: Redis Setup

For live deployments, Redis provides:
- Persistent preview tokens (survive server restarts)
- Rate limiting (prevent abuse)
- Cluster-safe token storage

Sign up at [console.upstash.com](https://console.upstash.com/) and copy REST API credentials.

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for deployment
npm run start            # Start built server
npm run typecheck        # TypeScript validation
npm run lint             # ESLint check
npm run uniform:manifest # Download Uniform context
```

## Project Structure

```
react-router-uniform/
├── app/                    # React Router application
│   ├── lib/                # Server utilities
│   ├── routes/             # Route handlers
│   └── root.tsx            # Root layout
├── ui/                     # Frontend code
│   ├── components/         # React components
│   ├── lib/                # Client utilities
│   └── styles/             # Global styles
├── uniform-data/           # Uniform project state
└── public/                 # Static assets
```
### Required Environment Variables

Set these in your hosting platform:
- `UNIFORM_API_KEY`
- `UNIFORM_PROJECT_ID`
- `UNIFORM_PREVIEW_SECRET` (use strong random string for live deployments)
- `UPSTASH_REDIS_REST_URL` (recommended)
- `UPSTASH_REDIS_REST_TOKEN` (recommended)
- `ENABLE_CSP=true` (recommended)

Geo quirks (`vc-country`, `vc-region`, `vc-city`) are populated automatically from Vercel's edge headers in production — no additional environment variables required. Use `UNIFORM_DEV_GEO_*` locally to test geo-targeted content.

### Before Deploying

- Change `UNIFORM_PREVIEW_SECRET` from default
- Enable CSP: `ENABLE_CSP=true`
- Configure Redis for rate limiting
- Run `npm audit`

## Troubleshooting

### Preview not working
- Verify `UNIFORM_PREVIEW_SECRET` matches Canvas settings
- Check `/api/preview` endpoint is accessible
- Ensure Redis is connected (if configured)

### Personalization variants not showing
- Run `npm run uniform:manifest`
- Check `contextManifest.json` exists in `app/lib/`
- Verify `behaviorTracking="onLoad"` on UniformComposition
- Check for `ufvd` cookie in browser

### Geo personalization not working locally
- Set `UNIFORM_DEV_GEO_COUNTRY`, `UNIFORM_DEV_GEO_REGION`, `UNIFORM_DEV_GEO_CITY` in `.env`
- Geo quirk keys in Uniform must match exactly: `vc-country`, `vc-region`, `vc-city`
- On Vercel, geo headers are injected automatically — no configuration needed

### Redis connection failures
- Verify credentials in `.env`
- Check Upstash dashboard for database status
- Test: `curl $UPSTASH_REDIS_REST_URL/ping -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"`

### Build errors
- Run `npm run uniform:manifest` first
- Clear cache: `rm -rf .react-router build`
- Check TypeScript: `npm run typecheck`

## Documentation

- [React Router v7 Docs](https://reactrouter.com/dev)
- [Uniform CMS Docs](https://docs.uniform.app)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with [Uniform CMS](https://uniform.app) and [React Router](https://reactrouter.com).
