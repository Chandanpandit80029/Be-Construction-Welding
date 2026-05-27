// Vercel serverless function example for secure Cloudinary deletions
// Usage: Deploy to Vercel and set env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const parsePublicIdFromUrl = (url) => {
  try {
    const u = new URL(url);
    // path like /<cloud_name>/image/upload/v123456/folder/sub/name.jpg
    const parts = u.pathname.split('/');
    // find the 'upload' segment, public id follows after any version segment (v123)
    const uploadIdx = parts.findIndex(p => p === 'upload');
    if (uploadIdx === -1) return null;
    let publicParts = parts.slice(uploadIdx + 1);
    // remove version segment if present (starts with 'v' and digits)
    if (publicParts[0] && /^v\d+/.test(publicParts[0])) publicParts = publicParts.slice(1);
    // join and strip file extension
    const publicIdWithExt = publicParts.join('/');
    const idx = publicIdWithExt.lastIndexOf('.');
    return idx === -1 ? publicIdWithExt : publicIdWithExt.substring(0, idx);
  } catch (e) {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { public_id, url } = req.body || {};
  let pid = public_id || null;
  if (!pid && url) pid = parsePublicIdFromUrl(url);
  if (!pid) return res.status(400).json({ success: false, error: 'Missing public_id or url (could not parse public_id)' });

  try {
    const result = await cloudinary.uploader.destroy(pid, { invalidate: true, resource_type: 'image' });
    return res.json({ success: true, result });
  } catch (err) {
    console.error('Cloudinary delete error', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
