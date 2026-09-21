# AutoAdmin architecture

## Deployments

- `admin.faalautos.com` — Next.js/MUI frontend, IP allowlisted.
- `api-admin.faalautos.com` — Render backend, IP allowlisted and authenticated.
- Public webhook endpoints should be isolated from the private admin API when external providers need inbound access.

## Data and authentication

Supabase Auth authenticates dashboard staff. `admin_profiles` stores `owner`, `admin`, or `moderator` metadata. The existing Faal Autos application data remains the business source of truth; AutoAdmin should not duplicate mechanics, passengers, or service requests into a separate database.

## Secrets

Browser code receives only public configuration. Render owns all backend secrets such as the Supabase service-role key, ModemPay secret, App Store Connect private credentials, and Google service-account credentials.

## Authorization

UI visibility is convenience only. The Render API must independently enforce every privileged action. Moderator requests to Finance should return `403` even when a URL is typed manually.
