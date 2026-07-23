# wikijr

Wiki app: TanStack Start (React 19, Vite, Tailwind 4) frontend at the repo root, deployed to Netlify. Supabase backend lives in `backend/` (imported via `git subtree` from the former standalone repo).

## Layout

- `src/` — frontend. Path alias `#/*` (and `@/*`) → `./src/*`.
- `src/lib/supabase.ts` — the Supabase client, typed with `Database`.
- `src/types/database.ts` — TypeScript types for the DB schema. Source of truth is `backend/supabase/migrations/*.sql`; keep this file in sync when migrations change. Regenerate with `npm run gen:types` (requires Docker + `supabase start` in `backend/`), or edit by hand in the same CLI-generated shape.
- `backend/supabase/migrations/` — schema: `pages`, `page_versions` (edit history, populated by a `SECURITY DEFINER` trigger on page update — never insert into it directly), plus a legacy `Test` table.
- `backend/supabase/functions/` — Deno edge functions (`pages`, `page-versions`, `crud-items`). Excluded from the frontend tsconfig; don't typecheck them with the root `tsc`.
- `backend/pages-api.md` — API documentation for the pages edge functions.

## Commands

- `npm run dev` — dev server on port 3000
- `npm run test` — vitest
- `npm run gen:types` — regenerate `src/types/database.ts` from the local Supabase stack

## Conventions

- Styling: `src/styles.css` is the design system. Palette lives as CSS variables in `:root` (light/dark), exposed as Tailwind utilities via `@theme inline` (`text-sea-ink`, `bg-lagoon-deep`, `border-line`, …). Buttons and form controls use the shared classes in `@layer components` — `.btn` + `.btn-primary`/`.btn-ghost`, `.btn-icon`, `.btn-link` (+ `-muted`/`-danger`), `.input`, `.popup` — not ad-hoc utility stacks or raw gray/slate/blue colors.
- RLS: all `pages` access requires an authenticated user; `page_versions` is read-only from the client.
- Backend syncing goes through GitHub (remote `supabaseproject` → https://github.com/danrald/supabaseproject.git), not the local `C:\_dev\supabaseproject` folder — git refuses pushes to a checked-out branch there. After pushing, run `git pull` inside that folder to update it.
- To push backend changes made here back to the backend repo: `git subtree push --prefix=backend supabaseproject main`.

## Get latest for the supabaseproject
git subtree pull --prefix=backend supabaseproject main

