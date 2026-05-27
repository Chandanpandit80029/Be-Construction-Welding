Deploying the secure Cloudinary deletion endpoint

This project includes two server-side scaffolds to securely delete Cloudinary assets without exposing your API secret:

- `server/cloudinary-delete.js` — local Express server example (dev).
- `serverless/vercel-cloudinary-delete.js` — Vercel serverless function scaffold.

Follow one of these deployment options.

1) Local dev server (quick test)

- Create a `.env.local` (or set environment variables) with:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=4000
```

- Install dependencies (if you haven't already):

```bash
npm install express cloudinary dotenv
```

- Run the local server:

```bash
node server/cloudinary-delete.js
```

- Test delete with `curl`:

```bash
curl -X POST http://localhost:4000/api/cloudinary/delete \
  -H "Content-Type: application/json" \
  -d '{"public_id":"folder/image_public_id"}'
```

2) Vercel (recommended for static frontend + serverless)

- Create a Vercel project pointing at this repo.
- Add these Environment Variables in your Vercel project settings:
  - `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
  - `CLOUDINARY_API_KEY` — Cloudinary API key
  - `CLOUDINARY_API_SECRET` — Cloudinary API secret

- Deploy. The serverless function path will be: `https://<your-vercel-site>/api/vercel-cloudinary-delete` (depending on how Vercel maps files — if you place the file under `api/`, adjust path accordingly). You can rename file to `api/cloudinary-delete.js` for a path of `/api/cloudinary-delete`.

- Set `VITE_CLOUDINARY_DELETE_URL` in your frontend environment to the deployed function URL (e.g., `https://your-site.vercel.app/api/cloudinary-delete`).

- Test via the frontend or `curl`:

```bash
curl -X POST https://your-site.vercel.app/api/cloudinary-delete \
  -H "Content-Type: application/json" \
  -d '{"public_id":"folder/image_public_id"}'
```

3) Netlify / Other providers

- Convert the Vercel scaffold to your provider's function format — the logic is the same: accept POST payload `{ public_id }` or `{ url }`, parse url -> public id fallback, then call Cloudinary `uploader.destroy(public_id)`.
- Set secrets in the provider dashboard.

Security notes

- Never put `CLOUDINARY_API_SECRET` in the frontend `.env` (do not set `VITE_...` for secret keys).
- Use provider secret storage (Vercel/Netlify/Firebase) and keep `VITE_CLOUDINARY_DELETE_URL` in your frontend env only.

If you want, I can:
- Rename `serverless/vercel-cloudinary-delete.js` to `api/cloudinary-delete.js` and adjust exports for Vercel so the path is `/api/cloudinary-delete` (recommended).
- Provide a ready `vercel.json` or Netlify `_redirects`/`netlify/functions` layout.
- Deploy to Vercel on your behalf if you give me the project details (or I can give step-by-step commands).
