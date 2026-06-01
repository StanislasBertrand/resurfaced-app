# Resurfaced

AI spend aggregator for startup teams. Queries billing/usage APIs from Anthropic, OpenAI, Mistral, and Gemini to show unified cost, token usage, and AI-powered insights.

## Stack

- **Next.js 16** full-stack app (App Router) hosted on **Vercel**
- TypeScript, Tailwind CSS v4
- Server Components for data fetching (provider APIs hit server-side, never in the browser)
- Route Handlers (`app/api/...`) for explicit API endpoints
- Server Actions for mutations

## Skills

Always follow the guidelines from these installed skills when writing code:

- `.agents/skills/next-best-practices` — Next.js App Router patterns, routing, data fetching, optimization, error handling
- `.agents/skills/vercel-react-best-practices` — React component patterns, state management, performance
- `.agents/skills/shadcn-ui-blocks` — shadcn/ui component & block selection, installation, and customization

Read and apply all skills before writing any Next.js or React code.

## UI Approach

- Use **shadcn/ui** for all UI components (buttons, cards, tables, charts, etc.)
- Use **ShadcnBlocks Pro** for pre-assembled page sections — install with `npx shadcn add @shadcnblocks/<block-name>`
- Use the `shadcn-ui-blocks` skill to pick the correct block/component for each UI need — it has the full catalog index
- The ShadcnBlocks Pro registry is configured in `components.json` with API key from `SHADCNBLOCKS_API_KEY` in `.env.local`
- Components and blocks live in the codebase (not an npm dependency) — customize freely
- Always check the ShadcnBlocks catalog before building UI from scratch — there are 1300+ blocks across marketing, app, and ecommerce categories

## Database

- **Never run `prisma migrate dev` or `prisma db push` without explicit approval** — always wait for the user to review the schema and ask for the migration to be applied
- Prisma schema lives at `prisma/schema.prisma`
- Neon Postgres via Vercel Marketplace
- Prisma config loads env from `.env.local`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Project Conventions

- Default to Server Components; only add `"use client"` for interactive components
- Push `"use client"` as far down the component tree as possible
- Fetch data in Server Components, pass down as props — never `useEffect` + `fetch` for initial data
- API keys go in `process.env.SECRET_NAME` (server-only), never `NEXT_PUBLIC_`
- Validate external input with Zod at system boundaries
- Use `loading.tsx` and `error.tsx` for route-level loading/error states
