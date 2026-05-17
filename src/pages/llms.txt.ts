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

- Email: official@devgo.studio
- Website: ${siteUrl}
- Location: Remote-first studio

# Sitemap

- Home: ${siteUrl}/
- Case Studies: ${siteUrl}/case-studies
- Showcase: ${siteUrl}/showcase

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
