# Feed Ferry — Backend (Supabase)

This app's "backend" is entirely Supabase (Postgres + Auth + Realtime) —
there is no separate Node/Express server. This folder just holds the
database schema and the credentials the frontend needs to talk to Supabase.

## Contents
- `supabase/schema.sql` — run this in your Supabase project to create all tables/policies.
- `.env.example` — template for the two values the frontend needs.

## Setup
1. Create a project at https://supabase.com
2. Open the SQL Editor in your Supabase dashboard, paste the contents of
   `supabase/schema.sql`, and run it.
3. In Supabase: Project Settings → API, copy the **Project URL** and the
   **anon public key**.
4. Put those two values into `frontend/.env.local` (see frontend README).
