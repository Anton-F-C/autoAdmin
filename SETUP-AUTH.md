# AutoAdmin authentication setup

## 1. Use the existing Faal Autos Supabase project

AutoAdmin does not need a second Supabase project. It uses the same project as AutoApp, while access is gated by `public.admin_profiles`.

## 2. Run the migration

Run `supabase/migrations/001_admin_profiles.sql` in the Supabase SQL editor.

## 3. Create the two staff Auth users

In Supabase Dashboard -> Authentication -> Users, create the company-email accounts for:

- Owner (you)
- Administrator (Ida)

Use email/password authentication. AutoAdmin has no public signup page.

## 4. Add staff profile rows

Copy each Auth user's UUID, then run:

```sql
insert into public.admin_profiles (user_id, email, display_name, role)
values
  ('OWNER-AUTH-UUID'::uuid, 'owner@faalautos.com', 'Owner Name', 'owner'),
  ('IDA-AUTH-UUID'::uuid, 'ida@faalautos.com', 'Ida', 'admin');
```

Change the email addresses/display names to the actual Faal Autos company credentials.

## 5. Create `.env.local`

Copy `.env.example` to `.env.local` and supply only the browser-safe Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:YOUR_BACKEND_PORT
```

Never put the Supabase service-role key, ModemPay secret, Apple private key, or Google service account in this frontend environment file.

## 6. Run locally

```bash
npm install
npm run dev
```

AutoAdmin runs on `http://localhost:3032` by default.

## Access behavior

- A valid Supabase login without an active `admin_profiles` row is rejected.
- Owner: full navigation including System/integrations.
- Admin: operational + finance access, no System/integration configuration.
- Moderator: read-only operational navigation, Finance hidden, System hidden.
- Finance and System also have direct route guards so hiding the sidebar is not the only protection.
- The backend must enforce the same permissions when live APIs are added.
