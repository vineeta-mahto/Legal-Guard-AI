# LegalGuard AI

AI-powered legal assistant for law firms and enterprises with ArmorIQ governance, cryptographic audit trails, and human-in-the-loop approval workflows.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/legalguard run dev` — run the frontend (reads PORT from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + framer-motion + recharts + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all contracts)
- `lib/db/src/schema/` — Drizzle schema files (one per domain entity)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/legalguard/src/pages/` — All frontend pages
- `artifacts/legalguard/src/components/layout/AppLayout.tsx` — Sidebar + app shell
- `artifacts/legalguard/src/index.css` — Full theme/color system

## Architecture decisions

- Contract-first API design: OpenAPI spec drives both Zod schemas (server validation) and React Query hooks (frontend). Never hand-write what codegen produces.
- ArmorIQ governance is implemented server-side in `/assistant/chat` — message content is scanned for sensitive action keywords; matched requests auto-create an approval record and return a blocked message instead of executing.
- Cryptographic receipts are generated automatically on approval (approve route) with a random SHA-256-style hash and base64 signature.
- All timestamps stored as PostgreSQL `timestamp` and serialized to ISO 8601 strings at the API boundary.
- Frontend routes use wouter; `/contracts/upload` must appear before `/contracts/:id` in the Switch.

## Product

- **Landing page** — Marketing page with hero, features, how-it-works, pricing
- **Login / Signup** — Authentication entry points
- **Dashboard** — Stats (pending approvals, contracts processed, blocked actions, AI confidence), charts (Recharts), recent activity feed
- **AI Legal Assistant** — Two-column chat interface with ArmorIQ intercept; sensitive actions blocked with approval creation
- **Contracts** — Searchable list; upload via drag-and-drop; per-contract analysis with risk score gauge, clause extraction, AI suggestions
- **Approval Center** — Queue of ArmorIQ-blocked actions; approve/reject with notes; auto-generates cryptographic receipt on approval
- **Audit Trail** — Timeline of all events with hash, status color-coding, search/filter
- **Cryptographic Receipts** — Blockchain-explorer-style cards with transaction hash, signature, verification status
- **Notifications** — Tabbed feed (Approvals, AI, Security, Audit)
- **Team** — Members table with role badges, invite dialog, permissions matrix
- **Settings** — Organization, security, integrations, API keys, approval policies

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, always re-run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Body schema names in openapi.yaml must be entity-shaped (e.g. `ContractInput`), never operation-shaped (e.g. `CreateContractBody`) — Orval auto-generates those names and a collision causes TS2308.
- The `evidenceRefs` field on chat messages is stored as a JSON string in the DB and parsed at the API boundary.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
