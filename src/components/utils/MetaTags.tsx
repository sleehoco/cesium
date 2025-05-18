
import { Helmet } from "react-helmet";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  canonical?: string;
}

const MetaTags = ({
  title = "CesiumCyber Security - Advanced Cybersecurity Solutions",
  description = "Professional cybersecurity services for modern businesses. Protect your digital assets with our comprehensive security solutions.",
  keywords = "cybersecurity, penetration testing, vulnerability assessment, security consulting, incident response, cloud security, compliance, GDPR, HIPAA",
  image = "/opengraph-image.png",
  url = "https://cesiumcyber.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "CesiumCyber Security",
  section = "Cybersecurity",
  canonical = "https://cesiumcyber.com"
}: MetaTagsProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="CesiumCyber Security" />
      
      {/* Article specific tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@cesiumcyber" />
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CesiumCyber Security",
            "url": "${url}",
            "logo": "${url}/lovable-uploads/b24b90f5-8a07-4589-821e-d614e2703fa9.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "(301) 531-5670",
              "contactType": "customer service",
              "email": "information@cesiumcyber.com",
              "areaServed": "US",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "3500 Cedar Ave.",
              "addressLocality": "Columbia",
              "addressRegion": "MD",
              "postalCode": "21045",
              "addressCountry": "US"
            },
            "sameAs": [
              "https://twitter.com/cesiumcyber",
              "https://www.linkedin.com/company/cesiumcyber"
            ]
          }
        `}
      </script>
    </Helmet>
  );
};

export default MetaTags;
