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

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)
