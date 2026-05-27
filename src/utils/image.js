// Helpers to normalize image fields which may be strings (legacy) or objects
export const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (img.url) return img.url;
  if (img.secure_url) return img.secure_url;
  // fallback to first value in object
  const vals = Object.values(img);
  for (const v of vals) {
    if (typeof v === 'string' && v.startsWith('http')) return v;
  }
  return null;
};

export const getPublicId = (img) => {
  if (!img) return null;
  if (typeof img === 'string') return null;
  if (img.public_id) return img.public_id;
  return null;
};

export default { getImageUrl, getPublicId };
