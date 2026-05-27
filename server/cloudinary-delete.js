// Simple Express server to securely delete Cloudinary images.
// Usage (development):
// 1. Install dependencies: npm install express body-parser cloudinary dotenv
// 2. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in a local .env
// 3. Run: node server/cloudinary-delete.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parsePublicIdFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    // find index of 'upload'
    const uploadIdx = parts.findIndex(p => p === 'upload');
    if (uploadIdx === -1) return null;

    // public id is everything after 'upload' ignoring version (starts with v\d+)
    let pubParts = parts.slice(uploadIdx + 1);
    if (pubParts[0] && /^v\d+$/.test(pubParts[0])) pubParts = pubParts.slice(1);
    const last = pubParts.join('/');
    // remove file extension
    return last.replace(/\.[^/.]+$/, '');
  } catch (e) {
    return null;
  }
}

app.post('/api/cloudinary/delete', async (req, res) => {
  const { url, public_id } = req.body;

  let publicId = public_id;
  if (!publicId && url) {
    publicId = parsePublicIdFromUrl(url);
  }

  if (!publicId) return res.status(400).json({ success: false, error: 'Missing public_id or url (could not parse public_id)' });

  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: 'image' });
    return res.json({ success: true, result });
  } catch (err) {
    console.error('Cloudinary delete error', err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Cloudinary delete server listening on http://localhost:${PORT}`);
});
