
import { Helmet } from "react-helmet";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const MetaTags = ({
  title = "CesiumCyber Security - Advanced Cybersecurity Solutions",
  description = "Professional cybersecurity services for modern businesses. Protect your digital assets with our comprehensive security solutions.",
  keywords = "cybersecurity, penetration testing, vulnerability assessment, security consulting, incident response",
  image = "/opengraph-image.png" // Default OG image path
}: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default MetaTags;
