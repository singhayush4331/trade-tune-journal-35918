
/**
 * Schema.org utilities for structured data
 * These functions generate JSON-LD structured data for better SEO
 */

/**
 * Creates schema.org Article structured data
 */
export const createArticleSchema = (
  title: string,
  description: string,
  url: string,
  imageUrl?: string,
  datePublished = "2025-05-01T00:00:00Z",
  dateModified = "2025-05-04T00:00:00Z",
  authorName = "Wiggly Trading Journal"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl || "https://wiggly.co.in/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png",
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Organization",
      "name": authorName,
      "url": "https://wiggly.co.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wiggly Trading Journal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wiggly.co.in/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
};

/**
 * Creates schema.org SoftwareApplication structured data
 */
export const createSoftwareApplicationSchema = (
  name: string,
  description: string,
  url: string,
  applicationCategory = "FinanceApplication",
  operatingSystem = "Any",
  price = "0",
  priceCurrency = "USD"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency
    },
    "url": url
  };
};

/**
 * Creates schema.org FAQPage structured data
 */
export const createFAQSchema = (faqs: {question: string, answer: string}[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
