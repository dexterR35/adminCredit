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

SQL files live in `migrations/`. **Remote history** (obtinecredit, as of 2026-06-08):

| Version | Name |
|---------|------|
| `20260603204500` | admin_rbac |
| `20260603230910` | web_client_status_constraint |
| `20260603231410` | baseline_sync |
| `20260603234419` | restore_anon_contract_storage |
| `20260603234458` | fix_contract_storage_upload_regex |
| `20260603234543` | sync_contract_public_access |
| `20260603234838` | authenticated_contract_storage_upload |
| `20260604120000` | security_and_rbac_fixes |
| `20260604180000` | fisa_report_status |
| `20260604190000` | consultant_status_update |
| `20260608073644` | harden_admin_auth_policies |
| `20260608073706` | fisa_report_attachments |

**Note:** Contract storage migrations were applied on the remote under `202606032344xx` timestamps. Local repo keeps equivalent SQL under `20260604140000` / `20260604200000` / `20260604210000` filenames for readability — do not re-apply those if the remote versions above are already present.

Apply to a linked project: `npx supabase db push`.  
`schema.sql` is a full reference script for manual repair — not a replacement for migrations.

## Cursor / MCP

Use the **Supabase** MCP plugin, sign in, and select project **obtinecredit**.  
Pass `project_id: uirnidboaxobewlchfut` if a tool asks for it.
