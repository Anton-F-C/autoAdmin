# AutoAdmin

Faal Autos internal operations portal, built from the licensed Minimal Next.js template.

## Roles
- **Owner**: all operational, financial, integration, role, and security permissions.
- **Administrator**: operational + financial management; no API/integration credential administration.
- **Moderator**: read-only operational access; Finance and privileged write actions are unavailable.

## Authentication/database direction
Use **Supabase Auth** for dashboard accounts and an `admin_profiles`/staff profile table for role and status metadata. The portal can use the same Faal Autos Supabase project so it can reference app users and service requests without duplicating business data. Sensitive third-party credentials remain server-side in Render environment variables.

## Security
- Secrets are never committed.
- Render holds backend production secrets.
- `admin.faalautos.com` and the private admin API should be IP allowlisted.
- Finance endpoints must enforce Owner/Admin roles server-side.
- Owner can replace credentials but the dashboard should never display existing plaintext secrets.

## Current milestone
The first pass establishes AutoAdmin branding, focused navigation, role scaffolding, environment-variable safety, and routes for the agreed operations areas while preserving reusable Minimal components.

## Admin authentication and profiles

AutoAdmin uses the **same Supabase project as AutoApp**, but dashboard access is separate from normal passenger/mechanic access.

1. Supabase Auth verifies the staff member's company email + password.
2. AutoAdmin then requires a matching, active `public.admin_profiles` row.
3. The profile supplies the dashboard role: `owner`, `admin`, or `moderator`.
4. A valid AutoApp/passenger/mechanic Supabase login without an active `admin_profiles` row is denied AutoAdmin access.
5. There is no public AutoAdmin sign-up flow.

Run `supabase/migrations/001_admin_profiles.sql` in the existing Faal Autos Supabase project, create the two staff users under **Authentication > Users**, then insert their profile rows using the UUIDs Supabase assigns.

### Presence

The dashboard uses Supabase Realtime Presence for live Online/Offline state. `last_seen_at` is updated through the restricted `touch_admin_last_seen()` RPC as a durable fallback when a staff member disconnects.

### Avatar

Each staff profile has an `avatar_url` field. The UI already consumes it in the header account button, account drawer, profile page, and Admin Team page. Avatar uploads can later be routed through the trusted backend or a dedicated Supabase Storage policy without changing these UI components.
