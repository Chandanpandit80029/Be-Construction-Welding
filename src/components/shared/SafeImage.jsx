import React from 'react';

/**
 * Local SVG fallback image encoded as data URI.
 * This replaces the dependency on external services like via.placeholder.com
 * which can be blocked or unavailable. Everything is self-contained.
 */
const FALLBACK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#e2e8f0"/>
    <g transform="translate(200,150)">
      <circle cx="0" cy="-20" r="30" fill="#94a3b8" opacity="0.4"/>
      <rect x="-60" y="20" width="120" height="80" rx="8" fill="#94a3b8" opacity="0.4"/>
      <text x="0" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">No Image</text>
    </g>
  </svg>`
);
const FALLBACK_DATA_URI = `data:image/svg+xml;charset=utf-8,${FALLBACK_SVG}`;

/**
 * SafeImage - An image component that never depends on external placeholder services.
 *
 * Features:
 * - Local SVG data URI fallback (no external requests)
 * - One-time onError handler to prevent infinite loops
 * - Lazy loading by default
 * - URL validation before rendering
 * - Handles null/undefined/empty src gracefully
 */
const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallback = FALLBACK_DATA_URI,
  style = {},
  loading = 'lazy',
  ...props
}) => {
  // Validate src - if invalid, use fallback immediately
  const isValid = src && typeof src === 'string' && src.trim().length > 0;

  return (
    <img
      src={isValid ? src : fallback}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={(e) => {
        // Set onerror to null to prevent infinite loop if fallback also fails
        e.target.onerror = null;
        if (e.target.src !== fallback) {
          e.target.src = fallback;
        }
      }}
      {...props}
    />
  );
};

export default SafeImage;
export { FALLBACK_DATA_URI };