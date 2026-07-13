
2. Installed the Supabase CLI


npm install supabase --save-dev
Available via npx supabase.

3. Initialized the Supabase project


npx supabase init
Created the supabase/ folder with config.toml, and .vscode/settings.json configured for the Deno language server (used by Edge Functions).

4. Created a CRUD Edge Function


npx supabase functions new crud-items
Then replaced the boilerplate in supabase/functions/crud-items/index.ts with a full handler supporting GET, POST, PUT, and DELETE on a Supabase table — scoped to the caller's JWT so Row Level Security policies apply automatically.

Next steps (to be done in your terminal):
npx supabase login
npx supabase link --project-ref gnedovuvtfxuukswfnpo
npx supabase db pull        # pulls your existing schema
npx supabase functions download  # pulls existing Edge Functions

## Sync up DB
npx supabase db pull --db-url "postgresql://postgres:your-password@db.gnedovuvtfxuukswfnpo.supabase.co:5432/postgres"

TO DO
Do you want to install the recommended 'Deno' extension from denoland for this repository?

npx supabase db pull "postgresql://postgres:QdzqIY8xPtYN37wl@db.gnedovuvtfxuukswfnpo.supabase.co:5432/postgres"

