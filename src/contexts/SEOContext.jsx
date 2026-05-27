import React, { createContext, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDocument } from '../hooks/useFirestore';
import { companyInfo } from '../constants';

const SEOContext = createContext();

export const useSEO = () => useContext(SEOContext);

const defaultSEO = {
  title: `${companyInfo.name} | Building Dreams, Forging Excellence`,
  description: companyInfo.description,
  keywords: 'construction, welding, steel fabrication, industrial construction, BE Construction',
  ogImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=630&fit=crop',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  canonical: '',
};

export const SEOMeta = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType,
  canonical,
  noIndex = false,
  schema 
}) => {
  const { data: seoSettings } = useDocument('websiteSettings', 'seo');
  const settings = seoSettings || {};
  
  const fullTitle = title 
    ? `${title} | ${companyInfo.shortName}`
    : defaultSEO.title;
  
  const metaDescription = description || settings.globalDescription || defaultSEO.description;
  const metaKeywords = keywords || settings.globalKeywords || defaultSEO.keywords;
  const metaImage = ogImage || settings.defaultOGImage || defaultSEO.ogImage;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://beconstruction.com';
  const metaCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaCanonical} />
      <meta property="og:type" content={ogType || 'website'} />
      <meta property="og:site_name" content={companyInfo.shortName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={defaultSEO.twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </Helmet>
  );
};

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyInfo.name,
    url: import.meta.env.VITE_SITE_URL || 'https://beconstruction.com',
    logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop',
    description: companyInfo.description,
    foundingDate: companyInfo.established,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyInfo.phone,
      email: companyInfo.email,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      addressRegion: companyInfo.address.state,
      postalCode: companyInfo.address.zipCode,
      addressCountry: companyInfo.address.country,
    },
    sameAs: Object.values(companyInfo.social).filter(Boolean),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const LocalBusinessSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.name,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=630&fit=crop',
    '@id': import.meta.env.VITE_SITE_URL || 'https://beconstruction.com',
    url: import.meta.env.VITE_SITE_URL || 'https://beconstruction.com',
    telephone: companyInfo.phone,
    email: companyInfo.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      addressRegion: companyInfo.address.state,
      postalCode: companyInfo.address.zipCode,
      addressCountry: companyInfo.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: companyInfo.location.lat,
      longitude: companyInfo.location.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '14:00',
      },
    ],
    sameAs: Object.values(companyInfo.social).filter(Boolean),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${import.meta.env.VITE_SITE_URL || 'https://beconstruction.com'}${item.path}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SEOContext;