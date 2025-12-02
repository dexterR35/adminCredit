# Deployment Guide for Admin Dashboard

## Server Structure
```
public_html/
├── index.html (main site - obtinecredit.ro)
├── assets/ (main site assets)
└── admin/ (this admin dashboard)
    ├── index.html
    ├── assets/
    └── .htaccess
```

## Build Steps

1. **Build the admin dashboard:**
   ```bash
   npm run build
   ```

2. **Copy build files to server:**
   - Copy everything from `dist/` folder to `public_html/admin/` on your server
   - Make sure `.htaccess` is copied to `public_html/admin/`

3. **Verify .htaccess is in place:**
   - The `.htaccess` file should be in `public_html/admin/.htaccess`
   - This handles client-side routing and prevents 404 errors on refresh

## Access URLs
- Main site: `https://obtinecredit.ro`
- Admin dashboard: `https://obtinecredit.ro/admin`
- Admin login: `https://obtinecredit.ro/admin/login`

## Important Notes
- All routes are relative to `/admin` base path
- The `.htaccess` file handles all routing for client-side navigation
- Make sure mod_rewrite is enabled on your Apache server

