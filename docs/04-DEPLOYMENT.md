# 4. Deployment instructions

The site is a standard Next.js 15 app. The recommended host is **Vercel** (free Hobby tier works for testing; a Pro plan is recommended for a business site). Any Node.js host that supports Next.js also works.

## 4.1 What you need

| Service | Purpose | Notes |
|---|---|---|
| GitHub account + private repository | Holds the code and content; needed for the CMS | Create a repo, e.g. `cleantique-website` |
| Vercel account | Hosting | Connect it to the GitHub repo |
| PostgreSQL database | Stores quote requests for `/admin/enquiries/` | Neon (free tier), Supabase or Vercel Postgres. Copy the connection string |
| Resend account | Emails each quote request to hi@cleantique.co.ke | Verify the `cleantique.co.ke` domain in Resend (adds DNS records) |
| Cloudflare Turnstile (optional) | Extra spam protection on the form | Free; create a widget for `cleantique.co.ke` |
| GitHub OAuth App | Sign-in for the content editor at `/cms/` | See 4.5 |

## 4.2 First deployment

1. **Push the code to GitHub.** In the `cleantique-website` folder:
   ```bash
   git init
   git add .
   git commit -m "Cleantique website"
   git branch -M main
   git remote add origin https://github.com/<you>/cleantique-website.git
   git push -u origin main
   ```
2. **Import into Vercel.** Vercel → Add New → Project → choose the repo. Framework: Next.js (auto-detected). Build command `npm run build`.
3. **Set environment variables** (Vercel → Project → Settings → Environment Variables). Use `.env.example` as the list. Minimum for production:
   - `NEXT_PUBLIC_SITE_URL=https://cleantique.co.ke`
   - `DATABASE_URL=…`
   - `RESEND_API_KEY=…`, `ENQUIRY_TO=hi@cleantique.co.ke`, `ENQUIRY_FROM=Cleantique Website <website@cleantique.co.ke>`
   - `ADMIN_USER=…`, `ADMIN_PASSWORD=…` (a long, unique password)
   - For the **Preview** environment only: `NEXT_PUBLIC_NOINDEX=1`
4. **Deploy.** Vercel builds and gives you a `*.vercel.app` URL. Test everything there first (see the launch checklist).

## 4.3 Going live on cleantique.co.ke

The domain currently points at the WordPress host. Do this when the launch checklist is complete:

1. Take a full backup of the WordPress site (files + database) and keep it.
2. In Vercel → Project → Settings → Domains, add `cleantique.co.ke` and `www.cleantique.co.ke`. Set `cleantique.co.ke` as primary (the old site used the bare domain).
3. At your DNS provider, update the records Vercel shows (an `A` record for the apex and a `CNAME` for `www`). **Do not touch MX records** — they control hi@cleantique.co.ke email.
4. Keep the Resend DNS records (SPF/DKIM) added in 4.1.
5. Wait for DNS to propagate (minutes to a few hours). Vercel issues the SSL certificate automatically.
6. Test the old URLs from `03-REDIRECTS.md` on the live domain.

## 4.4 Analytics and Search Console

- The GTM, GA4 and Google Ads IDs from the old site are already configured. In Google Tag Manager, check whether the container also fires GA4 or Google Ads tags. If it does, set `NEXT_PUBLIC_DISABLE_GTAG=1` to avoid double counting.
- **Conversion events** pushed to `dataLayer` (and to GA4 via gtag):
  - `generate_lead` — quote form submitted successfully (`service` parameter = division)
  - `click_call` — any `tel:` link
  - `click_whatsapp` — any WhatsApp link
  - `click_email` — any `mailto:` link
  In GA4 → Admin → Events, mark `generate_lead`, `click_call` and `click_whatsapp` as key events. In Google Ads, import them or set `NEXT_PUBLIC_ADS_LEAD_LABEL` to a conversion label.
- **Search Console:** the existing property for cleantique.co.ke keeps its history. After launch, submit `https://cleantique.co.ke/sitemap.xml`. If you need HTML-tag verification, set `NEXT_PUBLIC_GSC_VERIFICATION`.

## 4.5 Content editor (/cms/) setup

1. Edit `public/cms/config.yml` → `backend.repo` to `<your-github-user>/cleantique-website` and push.
2. GitHub → Settings → Developer settings → OAuth Apps → New:
   - Homepage URL: `https://cleantique.co.ke`
   - Authorization callback URL: `https://cleantique.co.ke/api/cms/callback/`
3. Copy the Client ID and generate a Client Secret; add them in Vercel as `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`; redeploy.
4. Visit `https://cleantique.co.ke/cms/`, sign in with GitHub. Only GitHub users with write access to the repo can edit.

Edits are saved as drafts (editorial workflow). Publishing a draft commits to `main`, and Vercel redeploys automatically in about a minute. See `CMS.md`.

## 4.6 Enquiries inbox

`https://cleantique.co.ke/admin/enquiries/` — sign in with `ADMIN_USER` / `ADMIN_PASSWORD`. You can filter by status, update status (new → contacted → quoted → booked / closed / spam), add internal notes, reply by phone/WhatsApp/email and download a CSV. The database table is created automatically on the first submission.

If `ADMIN_USER`/`ADMIN_PASSWORD` are not set, the admin area returns 404 rather than being left open.

## 4.7 Local development

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL`, local quote submissions are saved to `.data/enquiries.json`; without `RESEND_API_KEY`, no email is sent (the server logs a note). To view `/admin/enquiries/` locally, set `ADMIN_USER` and `ADMIN_PASSWORD` in `.env.local`.

## 4.8 Updating the site later

- Content: use `/cms/`, or edit files in `content/` and push.
- New images: add to `public/images/`, register in `src/lib/images.ts` with alt text, reference the key in content.
- New redirects: `content/redirects.json`.
- Business details (phone, hours, areas, social links): `content/site.json`.
