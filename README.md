# CesiumCyber

Marketing site and security tooling for CesiumCyber, built with Vite, React, TypeScript, Supabase, and Tailwind CSS.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deploy

Frontend is deployed separately from Supabase functions and database changes.

Typical release flow:

```sh
npm run build
supabase db push
supabase functions deploy <function-name>
vercel --prod
```
