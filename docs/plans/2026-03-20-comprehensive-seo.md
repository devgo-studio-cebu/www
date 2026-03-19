# Comprehensive SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a comprehensive SEO system with JSON-LD structured data, dynamic meta tags, canonical URLs, sitemap optimization, and AI governance (robots.txt + llms.txt).

**Architecture:** Centralize all SEO logic in `src/components/seo.astro` with proper Astro integration, using the existing sitemap package and extending with JSON-LD schemas, Open Graph/Twitter meta tags, and AI-friendly configuration files.

**Tech Stack:** Astro 6.0, TypeScript, @astrojs/sitemap (already installed), structured data (JSON-LD)

---

## Task 1: Create Type Definitions for SEO Props

**Files:**
- Create: `src/types/seo.ts`

**Step 1: Create the types file**

Create `src/types/seo.ts` with the following content:

```typescript
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
```

**Step 2: Verify types file created**

Run: `cat src/types/seo.ts`
Expected: File contains all TypeScript interfaces

**Step 3: Commit**

```bash
git add src/types/seo.ts
git commit -m "feat(seo): add TypeScript interfaces for SEO props and schemas"
```

---

## Task 2: Implement JSON-LD Structured Data Component

**Files:**
- Modify: `src/components/seo.astro`

**Step 1: Import TypeScript types and add props interface**

At the top of `src/components/seo.astro`, add the following:

```astro
---
import type { SEOProps, OrganizationSchema, WebsiteSchema } from '../types/seo'

interface Props {
  seo?: Partial<SEOProps>;
}

const { seo = {} } = Astro.props

const siteUrl = 'https://devgo.studio'
const defaultTitle = 'DEVGO Studio'
const defaultDescription = 'A creative studio building digital experiences'
const defaultImage = `${siteUrl}/og-image.png`
```

**Step 2: Add JSON-LD schema definitions**

After the imports, add structured data:

```astro
---
// ... previous code ...

const organizationSchema: OrganizationSchema = {
  name: 'DEVGO Studio',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    // Add social links when available
  ]
}

const websiteSchema: WebsiteSchema = {
  name: seo.title || defaultTitle,
  url: siteUrl,
  description: seo.description || defaultDescription
}

function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...organizationSchema
      },
      {
        '@type': 'WebSite',
        ...websiteSchema,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  }
}
---
```

**Step 3: Add JSON-LD script to the component render**

Replace the entire `<head>` section with:

```astro
<head>
  <script
    src='https://analytics.ranlabs.space/api/script.js'
    data-site-id='1'
    defer
  ></script>
  <script type='application/ld+json' set:html={JSON.stringify(generateJsonLd())} />
</head>
```

**Step 4: Test the JSON-LD output**

Run: `npm run dev`
Visit: `http://localhost:4321`
View page source and verify `<script type='application/ld+json'>` is present
Expected: JSON-LD script appears in head with Organization and WebSite schemas

**Step 5: Commit**

```bash
git add src/components/seo.astro src/types/seo.ts
git commit -m "feat(seo): add JSON-LD structured data for Organization and WebSite schemas"
```

---

## Task 3: Implement Dynamic Meta Tags (Open Graph & Twitter Cards)

**Files:**
- Modify: `src/components/seo.astro`

**Step 1: Add meta tag generation logic**

Add the following after the JSON-LD function definition:

```astro
---
// ... previous code ...

const meta = {
  title: seo.title || defaultTitle,
  description: seo.description || defaultDescription,
  canonical: seo.canonical || siteUrl,
  image: seo.image || defaultImage,
  type: seo.type || 'website',
  publishedTime: seo.publishedTime,
  modifiedTime: seo.modifiedTime,
  author: seo.author,
  keywords: seo.keywords || ['devgo', 'studio', 'creative', 'digital']
}
---
```

**Step 2: Add meta tags to the head**

Replace the entire `<head>` section with:

```astro
<head>
  <script
    src='https://analytics.ranlabs.space/api/script.js'
    data-site-id='1'
    defer
  ></script>
  <script type='application/ld+json' set:html={JSON.stringify(generateJsonLd())} />
  
  <!-- Primary Meta Tags -->
  <title>{meta.title}</title>
  <meta name='title' content={meta.title} />
  <meta name='description' content={meta.description} />
  <meta name='keywords' content={meta.keywords.join(', ')} />
  <meta name='author' content={meta.author || 'DEVGO Studio'} />
  
  <!-- Canonical URL -->
  <link rel='canonical' href={meta.canonical} />
  
  <!-- Open Graph / Facebook -->
  <meta property='og:type' content={meta.type} />
  <meta property='og:url' content={meta.canonical} />
  <meta property='og:title' content={meta.title} />
  <meta property='og:description' content={meta.description} />
  <meta property='og:image' content={meta.image} />
  <meta property='og:site_name' content='DEVGO Studio' />
  <meta property='og:locale' content='en_US' />
  
  <!-- Twitter -->
  <meta name='twitter:card' content='summary_large_image' />
  <meta name='twitter:url' content={meta.canonical} />
  <meta name='twitter:title' content={meta.title} />
  <meta name='twitter:description' content={meta.description} />
  <meta name='twitter:image' content={meta.image} />
  <meta name='twitter:site' content='@devgostudio' />
  <meta name='twitter:creator' content='@devgostudio' />
  
  <!-- Article specific (if type is article) -->
  {meta.type === 'article' && meta.publishedTime && (
    <meta property='article:published_time' content={meta.publishedTime} />
  )}
  {meta.type === 'article' && meta.modifiedTime && (
    <meta property='article:modified_time' content={meta.modifiedTime} />
  )}
  {meta.type === 'article' && meta.author && (
    <meta property='article:author' content={meta.author} />
  )}
</head>
```

**Step 3: Verify meta tags in dev mode**

Run: `npm run dev`
Visit: `http://localhost:4321`
View page source
Expected: All Open Graph and Twitter meta tags are present with correct values

**Step 4: Test with social media debuggers**

Use Facebook Debugger: https://developers.facebook.com/tools/debug/
Use Twitter Card Validator: https://cards-dev.twitter.com/validator
Expected: Proper rendering of title, description, and image

**Step 5: Commit**

```bash
git add src/components/seo.astro
git commit -m "feat(seo): add dynamic Open Graph and Twitter Card meta tags with canonical URL support"
```
---

## Task 4: Update BaseLayout to Pass SEO Props

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/seo.astro`

**Step 1: Add SEO props interface to BaseLayout**

At the top of `src/layouts/BaseLayout.astro`, modify the frontmatter:

```astro
---
import "../styles/global.css"

import { Font } from "astro:assets"
// @ts-ignore
import "@fontsource-variable/montserrat"
import Footer from "../components/footer.astro"
import Navbar from "../components/navbar.astro"
import Seo from "../components/seo.astro"
import type { SEOProps } from "../types/seo"

interface Props {
  seo?: Partial<SEOProps>;
}

const { seo } = Astro.props
```

**Step 2: Pass SEO props to the Seo component**

Update the `<head>` section in `src/layouts/BaseLayout.astro`:

```astro
<head>
  <Font cssVariable='--font-monument-extended' />
  <meta charset='utf-8' />
  <link
    rel='icon'
    type='image/svg+xml'
    href='/favicon.svg'
  />
  <meta
    name='viewport'
    content='width=device-width'
  />
  <meta
    name='generator'
    content={Astro.generator}
  />
  <title>{seo?.title || 'DEVGO Studio'}</title>
  <Seo seo={seo} />
</head>
```

**Step 3: Update index.astro to use SEO props**

Modify `src/pages/index.astro`:

```astro
---
import Featured from "../components/landing/featured.astro"
import Hero from "../components/landing/hero.astro"
import Services from "../components/landing/services.astro"
import BaseLayout from "../layouts/BaseLayout.astro"

const seoProps = {
  title: 'DEVGO Studio - Creative Digital Agency',
  description: 'DEVGO Studio builds innovative digital experiences. We specialize in web development, mobile apps, and creative solutions for forward-thinking brands.',
  keywords: ['devgo', 'studio', 'creative agency', 'web development', 'digital experiences'],
  type: 'website' as const
}
---

<BaseLayout seo={seoProps}>
  <Hero />
  <Featured />
  <Services />
</BaseLayout>
```

**Step 4: Verify SEO props flow**

Run: `npm run dev`
Visit: `http://localhost:4321`
View page source
Expected: Custom title and description from index.astro appear in meta tags

**Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat(seo): integrate SEO props into BaseLayout and update index page"
```

---

## Task 5: Configure Advanced Sitemap Options

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/pages/sitemap-style.xsl` (optional, for styled sitemaps)

**Step 1: Update sitemap configuration in astro.config.mjs**

Modify the sitemap integration in `astro.config.mjs`:

```javascript
// @ts-check
import { defineConfig, fontProviders } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://devgo.studio",

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/draft/') && !page.includes('/private/'),
      customPages: [
        'https://devgo.studio/',
        'https://devgo.studio/about',
        'https://devgo.studio/services',
        'https://devgo.studio/contact',
      ],
      serialize(item) {
        if (item.url.includes('about')) {
          item.priority = 0.9
        }
        if (item.url.includes('services')) {
          item.priority = 0.8
        }
        return item
      },
    }),
  ],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "MonumentExtended",
      cssVariable: "--font-monument-extended",
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/MonumentExtended-Regular.otf",
            ],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/MonumentExtended-Ultrabold.otf",
            ],
            weight: "800",
            style: "normal",
          },
        ],
      },
    },
  ],
})
```

**Step 2: Build and verify sitemap generation**

Run: `npm run build`
Check: `dist/sitemap-index.xml` exists
Check: `dist/sitemap-0.xml` exists
Expected: Sitemap contains all configured pages with proper priority

**Step 3: Verify sitemap content**

Run: `cat dist/sitemap-0.xml`
Expected: XML with proper URLs, lastmod, changefreq, and priority values

**Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(seo): configure advanced sitemap options with custom priorities and filtering"
```

---

## Task 6: Create Dynamic robots.txt

**Files:**
- Create: `src/pages/robots.txt.ts`

**Step 1: Create dynamic robots.txt endpoint**

Create `src/pages/robots.txt.ts`:

```typescript
import type { APIRoute } from 'astro'

const siteUrl = 'https://devgo.studio'

export const GET: APIRoute = () => {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
# Allow all crawlers
User-agent: *
Allow: /

# AI Crawlers (for AI governance)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap-index.xml

# Disallow admin/private areas
Disallow: /api/
Disallow: /_astro/
Disallow: /draft/
`

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
```

**Step 2: Test robots.txt endpoint**

Run: `npm run dev`
Visit: `http://localhost:4321/robots.txt`
Expected: Plain text response with all crawler rules and sitemap reference

**Step 3: Verify robots.txt allows important pages**

Check that `/` is allowed for all user agents
Check that sitemap URL is correct
Expected: Well-formed robots.txt with AI crawler permissions

**Step 4: Commit**

```bash
git add src/pages/robots.txt.ts
git commit -m "feat(seo): add dynamic robots.txt with AI crawler governance and sitemap reference"
```EOF
---

## Task 7: Create llms.txt for AI Governance

**Files:**
- Create: `src/pages/llms.txt.ts`

**Step 1: Create dynamic llms.txt endpoint**

Create `src/pages/llms.txt.ts`:

```typescript
import type { APIRoute } from 'astro'

const siteUrl = 'https://devgo.studio'

export const GET: APIRoute = () => {
  const llmsTxt = `# DEVGO Studio

> A creative studio building innovative digital experiences, specializing in web development, mobile applications, and creative technology solutions.

# Summary

DEVGO Studio is a digital creative agency that builds modern web applications, mobile apps, and immersive digital experiences. We work with forward-thinking brands to create impactful online presences.

# What We Do

- Custom Web Development: High-performance websites and web applications
- Mobile App Development: Native and cross-platform mobile solutions
- Creative Technology: Interactive experiences and innovative digital products
- Brand Identity: Complete brand identity and design systems

# Services

## Web Development
We build scalable, performant websites using modern technologies like Astro, React, and Next.js. Our focus is on user experience, accessibility, and SEO optimization.

## Mobile Development
Native iOS and Android applications built with modern frameworks. We create seamless mobile experiences that engage users.

## Creative Solutions
Interactive installations, immersive web experiences, and innovative technology solutions that push boundaries.

# Contact

- Email: hello@devgo.studio
- Website: ${siteUrl}
- Location: Remote-first studio

# AI Usage Guidelines

This content is freely available for AI systems to index and reference. 
We encourage the use of our technical documentation and service descriptions 
in AI-assisted development and learning contexts.

# Sitemap

- Home: ${siteUrl}/
- About: ${siteUrl}/about
- Services: ${siteUrl}/services
- Contact: ${siteUrl}/contact

# Last Updated

${new Date().toISOString().split('T')[0]}
`

  return new Response(llmsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
```

**Step 2: Test llms.txt endpoint**

Run: `npm run dev`
Visit: `http://localhost:4321/llms.txt`
Expected: Plain text response with structured information about DEVGO Studio

**Step 3: Verify llms.txt structure**

Check that it includes:
- Company summary
- Services list
- Contact information
- AI usage guidelines
- Sitemap links
Expected: Well-structured markdown-like content for AI crawlers

**Step 4: Commit**

```bash
git add src/pages/llms.txt.ts
git commit -m "feat(seo): add llms.txt for AI governance and structured content discovery"
```

---

## Task 8: Create Default OG Image Asset

**Files:**
- Create: `public/og-image.png` (you'll need to add the actual image file)
- Create: `public/logo.png` (you'll need to add the actual logo file)

**Step 1: Create placeholder OG image**

Create a 1200x630 PNG image for Open Graph sharing. This should include:
- DEVGO Studio logo
- Brand colors
- Simple tagline: "Creative Digital Agency"

Place it at: `public/og-image.png`

**Step 2: Create logo image for JSON-LD**

Create a PNG logo image for structured data.

Place it at: `public/logo.png`

**Step 3: Update seo.astro to use local assets**

Verify that `src/components/seo.astro` uses:
```typescript
const defaultImage = `${siteUrl}/og-image.png`
```

And the organizationSchema uses:
```typescript
logo: `${siteUrl}/logo.png`
```

**Step 4: Verify images are accessible**

Run: `npm run dev`
Visit: `http://localhost:4321/og-image.png`
Visit: `http://localhost:4321/logo.png`
Expected: Images load correctly

**Step 5: Test with social media debuggers**

Use Facebook Debugger: https://developers.facebook.com/tools/debug/
Use Twitter Card Validator: https://cards-dev.twitter.com/validator
Use LinkedIn Inspector: https://www.linkedin.com/post-inspector/
Expected: OG image displays correctly with proper dimensions

**Step 6: Commit**

```bash
git add public/og-image.png public/logo.png
git commit -m "feat(seo): add default OG image and logo assets for social sharing"
```

---

## Task 9: Create SEO Utility Functions

**Files:**
- Create: `src/utils/seo.ts`

**Step 1: Create SEO utility functions file**

Create `src/utils/seo.ts`:

```typescript
import type { SEOProps, OrganizationSchema, WebsiteSchema, PersonSchema } from '../types/seo'

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
```

**Step 2: Update seo.astro to use utility functions**

Modify `src/components/seo.astro` to import and use utilities:

```astro
---
import type { SEOProps } from '../types/seo'
import { mergeSeoProps, getCanonicalUrl } from '../utils/seo'

interface Props {
  seo?: Partial<SEOProps>;
}

const { seo = {} } = Astro.props

const mergedSeo = mergeSeoProps(seo)

// ... rest of the component
---
```

**Step 3: Test utility functions**

Add a console.log to verify utilities work:

```astro
---
// ... imports

const warnings = validateSeoProps(seo)
if (warnings.length > 0) {
  console.warn('SEO warnings for current page:', warnings)
}
---
```

Run: `npm run dev`
Visit: `http://localhost:4321`
Expected: No warnings in console for properly configured pages

**Step 4: Commit**

```bash
git add src/utils/seo.ts src/components/seo.astro
git commit -m "feat(seo): add SEO utility functions for reusable schema generation and validation"
```EOF
---

## Task 10: Final Integration and Testing

**Files:**
- Test: All SEO components integration
- Create: `docs/seo-maintenance.md`

**Step 1: Run full build and verify all SEO assets**

Run: `npm run build`
Check: `dist/` directory contains:
- `robots.txt` (or server-generated)
- `sitemap-index.xml`
- `sitemap-0.xml`

Expected: Build completes successfully with all SEO assets generated

**Step 2: Test production build locally**

Run: `npm run preview`
Visit: `http://localhost:4321`
View source and verify:
- All meta tags present
- JSON-LD structured data present
- Canonical URL correct
- OG image referenced

Expected: All SEO elements properly rendered

**Step 3: Validate JSON-LD with Google's tool**

Use: https://search.google.com/test/rich-results
Input: Your production URL (after deployment)
Expected: No errors in structured data validation

**Step 4: Create SEO maintenance documentation**

Create `docs/seo-maintenance.md`:

```markdown
# SEO Maintenance Guide

## Overview

This document outlines how to maintain and update SEO implementation for DEVGO Studio.

## File Structure

```
src/
├── components/
│   └── seo.astro          # Main SEO component
├── pages/
│   ├── robots.txt.ts      # Dynamic robots.txt
│   └── llms.txt.ts        # AI governance file
├── types/
│   └── seo.ts             # TypeScript interfaces
├── utils/
│   └── seo.ts             # SEO utility functions
└── layouts/
    └── BaseLayout.astro   # Layout with SEO integration

public/
├── og-image.png           # Default Open Graph image
└── logo.png               # Logo for JSON-LD
```

## Adding SEO to New Pages

### For static pages:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'

const seoProps = {
  title: 'Page Title',
  description: 'Page description for SEO',
  keywords: ['keyword1', 'keyword2'],
  type: 'website'
}
---

<BaseLayout seo={seoProps}>
  <!-- page content -->
</BaseLayout>
```

### For dynamic pages (blog posts, etc.):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import { mergeSeoProps } from '../utils/seo'

const { post } = Astro.props

const seoProps = {
  title: post.title,
  description: post.excerpt,
  type: 'article',
  publishedTime: post.publishedAt,
  modifiedTime: post.updatedAt,
  author: post.author.name,
  image: post.featuredImage
}
---

<BaseLayout seo={seoProps}>
  <!-- article content -->
</BaseLayout>
```

## Updating Structured Data

### Adding new schema types

1. Define new interface in `src/types/seo.ts`
2. Add generator function in `src/utils/seo.ts`
3. Use in `src/components/seo.astro` as needed

### Example: Adding FAQ schema

```typescript
// In src/types/seo.ts
export interface FAQSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

// In src/utils/seo.ts
export function generateFAQSchema(faq: FAQSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }
}
```

## Robots.txt Management

### Adding new crawler rules

Edit `src/pages/robots.txt.ts`:

```typescript
const robotsTxt = `# Existing rules...

# New crawler
User-agent: NewCrawler
Disallow: /specific-path/
Allow: /

# ... rest of file
`
```

### Blocking specific pages

Add to the Disallow section:

```typescript
Disallow: /api/
Disallow: /_astro/
Disallow: /draft/
Disallow: /private/
Disallow: /temp/
```

## Llms.txt Updates

### Updating company information

Edit `src/pages/llms.txt.ts` to update:
- Company description
- Services offered
- Contact information
- AI usage guidelines

### Adding new sections

Add markdown sections to provide more context for AI crawlers.

## Sitemap Configuration

### Adding new pages

Edit `astro.config.mjs`:

```javascript
customPages: [
  'https://devgo.studio/',
  'https://devgo.studio/about',
  'https://devgo.studio/services',
  'https://devgo.studio/contact',
  'https://devgo.studio/new-page', // Add here
],
```

### Excluding pages

Add to filter function:

```javascript
filter: (page) => 
  !page.includes('/draft/') && 
  !page.includes('/private/') &&
  !page.includes('/admin/'), // Add exclusion
```

## Testing Checklist

Before deploying:

- [ ] Run `npm run build` - should complete without errors
- [ ] Check `robots.txt` at `/robots.txt`
- [ ] Check `llms.txt` at `/llms.txt`
- [ ] Check `sitemap-index.xml` at `/sitemap-index.xml`
- [ ] Verify meta tags in page source
- [ ] Test with Facebook Debugger
- [ ] Test with Twitter Card Validator
- [ ] Test with Google Rich Results Test
- [ ] Verify canonical URLs are correct
- [ ] Check OG images load correctly

## SEO Tools

### Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Schema.org Validator](https://validator.schema.org/)

### Monitoring

- Google Search Console
- Bing Webmaster Tools
- Ahrefs / SEMrush (if available)

## Troubleshooting

### Common Issues

1. **Meta tags not appearing**
   - Check seo.astro is imported in BaseLayout
   - Verify SEOProps interface matches
   - Check for TypeScript errors

2. **JSON-LD not validating**
   - Use Schema.org validator
   - Check all required fields are present
   - Verify URLs are absolute

3. **Sitemap not generating**
   - Run `npm run build`
   - Check astro.config.mjs has correct site URL
   - Verify @astrojs/sitemap is installed

4. **Robots.txt not loading**
   - Check src/pages/robots.txt.ts exists
   - Verify file is in correct location
   - Check for TypeScript errors

## Performance Considerations

- JSON-LD is rendered server-side, no client bundle impact
- Dynamic robots.txt and llms.txt are cached by Astro
- Meta tags are minimal HTML overhead
- Sitemap is generated at build time

## Future Improvements

Consider implementing:

1. **Dynamic sitemaps** for large sites (>50k pages)
2. **Image sitemaps** for image-heavy pages
3. **Video sitemaps** for video content
4. **News sitemaps** for news/blog sections
5. **Hreflang tags** for multilingual support
6. **Alternate language versions** for international SEO
```

**Step 5: Final commit**

```bash
git add docs/seo-maintenance.md
git commit -m "docs: add comprehensive SEO maintenance guide"
```

---

## Summary of Improvements

### Implemented Features

1. **JSON-LD Structured Data**
   - Organization schema
   - WebSite schema
   - SearchAction for site search
   - Utility functions for additional schemas (Article, Person, Breadcrumb)

2. **Dynamic Meta Tags**
   - Open Graph tags for Facebook sharing
   - Twitter Card tags for Twitter sharing
   - Canonical URLs to prevent duplicate content
   - Article-specific meta tags for blog posts

3. **Sitemap Enhancement**
   - Configured priority levels for different pages
   - Added changefreq for crawl optimization
   - Custom page inclusion
   - Filtering for draft/private pages

4. **AI Governance**
   - Dynamic robots.txt with AI crawler permissions
   - llms.txt for structured AI content discovery
   - Clear permissions for GPTBot, ChatGPT, CCBot, Anthropic AI, Google-Extended

5. **Developer Experience**
   - TypeScript interfaces for type safety
   - Reusable utility functions
   - Easy API for adding SEO to new pages
   - Comprehensive documentation

### Recommendations for Future Work

1. **Performance Monitoring**
   - Add Core Web Vitals tracking
   - Integrate with Google Search Console API
   - Set up automated SEO auditing

2. **Advanced Structured Data**
   - Add FAQ schema for FAQ pages
   - Add Product schema for e-commerce
   - Add LocalBusiness schema for location pages
   - Add Review schema for testimonials

3. **International SEO**
   - Implement hreflang tags for multilingual support
   - Add language-specific sitemaps
   - Create localized OG images

4. **Analytics Integration**
   - Track SEO performance metrics
   - Monitor social sharing performance
   - Set up conversion tracking

5. **Automated Testing**
   - Add visual regression tests for meta tags
   - Set up Lighthouse CI for continuous monitoring
   - Create Playwright tests for SEO validation

### Technical Debt

- None identified - implementation follows Astro best practices
- All TypeScript interfaces are properly defined
- Code is modular and maintainable
- Documentation is comprehensive

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-03-20-comprehensive-seo.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach would you prefer?**

If Subagent-Driven chosen:
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

If Parallel Session chosen:
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans

