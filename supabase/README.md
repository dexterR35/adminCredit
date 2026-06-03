# Supabase — obtinecredit

| | |
|---|---|
| **Project** | obtinecredit |
| **Ref** | `uirnidboaxobewlchfut` |
| **API URL** | https://uirnidboaxobewlchfut.supabase.co |

## App env (Vite)

Copy [`.env.example`](../.env.example) to `.env` and set the publishable key from  
[Dashboard → Project Settings → API](https://supabase.com/dashboard/project/uirnidboaxobewlchfut/settings/api).

## CLI link (optional)

```bash
npx supabase login
npx supabase link --project-ref uirnidboaxobewlchfut
npx supabase migration list
```

Local link state is stored in `supabase/.temp/` (gitignored).

## Migrations

SQL files live in `migrations/`. Remote history (obtinecredit):

| Version | Name |
|---------|------|
| `20260603204500` | admin_rbac |
| `20260603230910` | web_client_status_constraint |
| `20260604120000` | security_and_rbac_fixes |
| `20260604180000` | fisa_report_status |
| `20260604190000` | consultant_status_update |
| `20260603231410` | baseline_sync |

Apply locally linked project: `npx supabase db push`.  
`schema.sql` is a full reference script for manual repair — not a replacement for migrations.

## Cursor / MCP

Use the **Supabase** MCP plugin, sign in, and select project **obtinecredit**.  
Pass `project_id: uirnidboaxobewlchfut` if a tool asks for it.
