// Front-end Cloudinary helper: calls a secure server endpoint to delete images.
// The frontend should never hold the Cloudinary API secret. Configure
// VITE_CLOUDINARY_DELETE_URL to point to a secure serverless function or local server.

export const callDeleteEndpoint = async (payload) => {
  const endpoint = import.meta.env.VITE_CLOUDINARY_DELETE_URL;
  if (!endpoint) {
    throw new Error('Cloudinary delete endpoint not configured (VITE_CLOUDINARY_DELETE_URL)');
  }

  const body = typeof payload === 'string' ? { url: payload } : payload || {};

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete failed: ${text}`);
  }

  return res.json();
};

// Utility: detect if URL is a Cloudinary resource
export const isCloudinaryUrl = (url) => {
  try {
    const u = new URL(url);
    return u.hostname.includes('res.cloudinary.com');
  } catch (e) {
    return false;
  }
};

// Named exports are above; keep a single default export for cloudinaryConfig below.
// Cloudinary Configuration
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "your-api-key",
};

// Cloudinary URL Builder configuration
export const cloudinaryUrlBuilder = {
  cloudName: cloudinaryConfig.cloudName,
};

// Upload widget configuration
export const uploadWidgetConfig = {
  cloudName: cloudinaryConfig.cloudName,
  uploadPreset: cloudinaryConfig.uploadPreset,
  sources: ['local', 'url', 'camera'],
  multiple: true,
  maxFileSize: 100000000, // 100MB
  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'],
  maxImageWidth: 2000,
  maxImageHeight: 2000,
  cropping: true,
  croppingAspectRatio: 16/9,
  croppingShowDimensions: true,
  folder: 'be-construction-welding',
  resourceType: 'auto',
  theme: 'purple',
  styles: {
    'source-panel': {
      background: '#1a1a1a',
    },
    'gallery-panel': {
      background: '#2d2d2d',
    },
    'header': {
      background: '#f59e0b',
    },
    'footer': {
      background: '#1a1a1a',
    },
  },
};

// Transformation presets for different use cases
export const transformations = {
  // Thumbnail
  thumbnail: {
    width: 300,
    height: 200,
    crop: 'fill',
    quality: 'auto',
  },
  // Card image
  card: {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
  },
  // Gallery image
  gallery: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
  },
  // Full size
  full: {
    quality: 'auto',
  },
  // Hero/banner
  hero: {
    width: 1920,
    height: 800,
    crop: 'fill',
    quality: 'auto',
  },
};

// Helper function to generate Cloudinary URL
export const getCloudinaryUrl = (publicId, transformation = null) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
  if (transformation) {
    const transforms = Object.entries(transformation)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    return `${baseUrl}/${transforms}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

export default cloudinaryConfig;