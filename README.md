# Feed Ferry

- `frontend/` — React + Vite + Tailwind app
- `backend/` — Supabase schema + env template (no custom server; Supabase is the backend)

See each folder's README for details.

## Run the whole app

1. **Create the Supabase project & database**
   - Go to https://supabase.com and create a new project.
   - Open the SQL Editor, paste in `backend/supabase/schema.sql`, run it.
   - Go to Project Settings → API and copy the **Project URL** and **anon public key**.

2. **Configure the frontend**
   ```
   cd frontend
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and paste in your values:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Install & run**
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Open the URL Vite prints (usually http://localhost:5173).

4. **Build for production** (optional)
   ```
   npm run build
   npm run preview
   ```

That's it — there's no separate backend server to start; the React app talks to Supabase directly using the URL/key from step 2.
