import type { SEOProps, OrganizationSchema, PersonSchema, ServiceSchema } from '../types/seo'

export const siteUrl = 'https://devgo.studio'
export const siteName = 'DEVGO Studio'
export const defaultDescription = 'A creative studio building innovative digital experiences, specializing in web development, mobile applications, and creative technology solutions.'

/**
 * Generates canonical URL for a given path
 */
export function getCanonicalUrl(path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${cleanPath}`
}

/**
 * Generates Open Graph image URL
 */
export function getOgImageUrl(path: string = '/og-image.png'): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Generates default SEO props for a page
 */
export function getDefaultSeoProps(path: string = '/'): Partial<SEOProps> {
  return {
    canonical: getCanonicalUrl(path),
    image: getOgImageUrl(),
    type: 'website',
    keywords: ['devgo', 'studio', 'creative agency', 'web development', 'digital experiences']
  }
}

/**
 * Merges custom SEO props with defaults
 */
export function mergeSeoProps(custom: Partial<SEOProps>, path?: string): SEOProps {
  const defaults: SEOProps = {
    title: siteName,
    description: defaultDescription,
    ...getDefaultSeoProps(path)
  }

  return {
    ...defaults,
    ...custom,
    keywords: custom.keywords ? [...defaults.keywords!, ...custom.keywords] : defaults.keywords
  }
}

/**
 * Generates Person schema for team members or authors
 */
export function generatePersonSchema(person: PersonSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...person
  }
}

/**
 * Generates Article schema for blog posts
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      ...article.author
    },
    publisher: {
      '@type': 'Organization',
      ...article.publisher
    }
  }
}

/**
 * Generates BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

/**
 * Generates Service/ItemList schema for services offered
 */
export function generateServiceSchema(
  services: ServiceSchema[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: service.provider,
        ...(service.areaServed && { areaServed: service.areaServed }),
        ...(service.serviceType && { serviceType: service.serviceType }),
      },
    })),
  }
}

/**
 * Validates SEO props and returns warnings for missing required fields
 */
export function validateSeoProps(props: Partial<SEOProps>): string[] {
  const warnings: string[] = []

  if (!props.title) warnings.push('Missing title')
  if (!props.description) warnings.push('Missing description')
  if (props.image && !props.image.startsWith('http')) {
    warnings.push('Image should be an absolute URL')
  }
  if (props.canonical && !props.canonical.startsWith('http')) {
    warnings.push('Canonical should be an absolute URL')
  }

  return warnings
}
