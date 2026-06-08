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
- The app auto-detects `/admin` as its router base when opened under that path.
- Vite builds asset URLs as relative paths, so the copied `dist/` folder works from `/admin/`.
- The `.htaccess` file is copied from `public/.htaccess` during build and handles client-side routing.
- Make sure mod_rewrite is enabled on your Apache server

