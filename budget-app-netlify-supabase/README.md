
# Budget App — Netlify + Supabase ready

Minimal React + Vite + TypeScript app with IndexedDB offline storage and a tiny service worker.

## Quick start

```bash
npm i
cp .env.example .env # add your Supabase URL & anon key (optional for MVP local-only)
npm run dev
```

## Deploy on Netlify

- Push this folder to a Git repo, then "Import project" in Netlify.
- Build command: `npm run build`
- Publish directory: `dist`
- Add env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Notes
- Data persists in the browser via IndexedDB (Dexie).
- Supabase client is initialized but not used yet; you can wire sync later.
- PWA: simple cache-first SW in `public/service-worker.js`.
