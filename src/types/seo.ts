export interface ServiceSchema {
  "@type"?: "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  areaServed?: string;
  serviceType?: string;
  offers?: {
    "@type": "Offer";
    description: string;
  }[];
}

export interface ReviewSchema {
  "@type"?: "Review";
  author: string;
  reviewBody: string;
  reviewRating: {
    "@type"?: "Rating";
    ratingValue: number;
    bestRating: number;
  };
  datePublished?: string;
}

export interface FAQSchema {
  "@type"?: "FAQPage";
  questions: {
    "@type"?: "Question";
    question: string;
    answer: string;
  }[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface PageSchema {
  type: "BreadcrumbList" | "FAQPage" | "Service" | "Review";
  items?: BreadcrumbItem[];
  questions?: FAQSchema["questions"];
  services?: ServiceSchema[];
  reviews?: ReviewSchema[];
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  schema?: PageSchema;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export interface WebsiteSchema {
  name: string;
  url: string;
  description: string;
}

export interface PersonSchema {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  worksFor?: OrganizationSchema;
}
