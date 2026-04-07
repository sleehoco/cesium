
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
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
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
  canonical = "https://cesiumcyber.com",
  schema,
}: MetaTagsProps) => {
  const imageUrl = image.startsWith("http") ? image : `${url}${image}`;
  const structuredData = schema ?? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "name": "CesiumCyber Security",
        "url": url,
        "image": imageUrl,
        "logo": `${url}/favicon.ico`,
        "telephone": "+1-301-531-5670",
        "email": "information@cesiumcyber.com",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "3500 Cedar Ave.",
          "addressLocality": "Columbia",
          "addressRegion": "MD",
          "postalCode": "21045",
          "addressCountry": "US"
        },
        "areaServed": [
          "Maryland",
          "Virginia",
          "Washington, DC",
          "United States"
        ],
        "sameAs": [
          "https://twitter.com/cesiumcyber",
          "https://www.linkedin.com/company/cesiumcyber"
        ]
      },
      {
        "@type": "WebSite",
        "name": "CesiumCyber Security",
        "url": url
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="CesiumCyber cybersecurity services" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="CesiumCyber Security" />
      
      {/* Article specific tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@cesiumcyber" />
      <meta name="twitter:creator" content="@cesiumcyber" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default MetaTags;
