
import { Helmet } from "react-helmet";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const MetaTags = ({
  title = "CesiumCyber Security - Advanced Cybersecurity Solutions",
  description = "Professional cybersecurity services for modern businesses. Protect your digital assets with our comprehensive security solutions.",
  keywords = "cybersecurity, penetration testing, vulnerability assessment, security consulting, incident response"
}: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default MetaTags;
