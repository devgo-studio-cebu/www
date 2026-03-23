# Content Management Guide

This guide covers how to manage and update content on the DEVGO Studio website, including reviews, showcased projects, featured projects, and case studies.

## Table of Contents

- [Managing Reviews](#managing-reviews)
- [Managing Showcased Projects](#managing-showcased-projects)
- [Managing Featured Projects](#managing-featured-projects)
- [Creating Case Studies](#creating-case-studies)
- [Asset Management](#asset-management)
- [Best Practices](#best-practices)

---

## Managing Reviews

Reviews are client testimonials displayed on the homepage. They are stored in `src/lib/reviews.ts`.

### Review Structure

```typescript
interface Review {
    name: string          // Client's full name
    company: string       // Company name (with optional "(Placeholder)" prefix)
    review: string        // Testimonial text (2-4 sentences)
    link?: string         // Optional: Link to client's website
}
```

### Adding a New Review

1. Open `src/lib/reviews.ts`

2. Add a new review object to the `reviews` array:

```typescript
{
    name: "Client Name",
    company: "Company Name",
    review: "Detailed testimonial about working with DEVGO Studio. Keep it authentic and specific about the results achieved.",
    link: "https://company-website.com"  // Optional
}
```

### Example

```typescript
{
    name: "Julienne Sombrio",
    company: "(Placeholder) Derma Doc Skin Specialist",
    review: "DEVGO Studio has been an invaluable partner in our digital transformation journey. Their expertise in web development and design has helped us create a stunning online presence that truly reflects our brand. The team is responsive, professional, and always goes the extra mile to ensure our satisfaction. We highly recommend DEVGO Studio for any business looking to elevate their digital presence.",
    link: "https://dermadocskinspecialist.com"
}
```

### Tips

- Keep reviews between 150-300 characters for optimal display
- Include specific results or outcomes when possible
- Mark with "(Placeholder)" if using placeholder content
- Verify all website links before publishing

---

## Managing Showcased Projects

Showcased projects appear on the `/showcase` page. They are stored in `src/lib/showcase.ts`.

### Showcased Project Structure

```typescript
interface Project {
    title: string          // Project name
    image: ImageMetadata   // Imported image asset
    url?: string          // Optional: Live project URL
    year: number          // Completion year
}
```

### Adding a New Showcased Project

1. **Prepare the project image**
   - Size: 1200x800px or 16:9 aspect ratio
   - Format: PNG or WebP
   - Location: `src/assets/works/`

2. **Import the image** at the top of `src/lib/showcase.ts`:

```typescript
import projectImage from '../assets/works/project-name.png'
```

3. **Add the project** to the `projects` array:

```typescript
{
    title: "Project Name",
    image: projectImage,
    url: "https://project-url.com",  // Optional
    year: 2026
}
```

### Example

```typescript
import groundsph from '../assets/works/groundsph.png'

export const projects: Project[] = [
    {
        title: "Grounds.ph",
        image: groundsph,
        url: "https://grounds.ph",
        year: 2026
    }
]
```

### Image Requirements

| Property | Requirement |
|----------|-------------|
| Format | PNG or WebP |
| Max Size | 500KB |
| Naming | lowercase-with-hyphens.png |

---

## Managing Featured Projects

Featured projects appear in the "Featured Work" section on the homepage. They are stored in `src/lib/featured.ts`.

### Featured Project Structure

```typescript
interface FeaturedProject {
    title: string          // Project name
    image: ImageMetadata   // Imported image asset
    tags: string[]        // Array of service tags (2-3 max)
    link?: string         // Optional: Project URL
}
```

### Adding a New Featured Project

1. **Prepare the project image**
   - Size: 1200x800px
   - Format: PNG or WebP
   - Location: `src/assets/works/`

2. **Import the image** at the top of `src/lib/featured.ts`:

```typescript
import projectImage from '../assets/works/project-name.png'
```

3. **Add the project** to the `featuredProjects` array:

```typescript
{
    title: "Project Name",
    image: projectImage,
    tags: ["Website", "UI/UX Design"],  // 2-3 tags recommended
    link: "https://project-url.com"     // Optional
}
```

### Example

```typescript
import groundsph from '../assets/works/groundsph.png'

export const featuredProjects: FeaturedProject[] = [
    {
        title: "Grounds.ph",
        image: groundsph,
        tags: ["Website", "UI/UX Design"],
        link: "https://grounds.ph"
    }
]
```

### Recommended Tags

- Website
- UI/UX Design
- E-Commerce
- Mobile App
- Branding
- Web Application
- AI Integration
- API Development

---

## Creating Case Studies

Case studies are detailed project write-ups with rich content support. They are stored in `src/content/case-studies/`.

### File Structure

```
src/content/case-studies/
├── example.mdx           # Example case study
├── project-name.mdx      # Your case study
└── another-project/
    ├── index.mdx        # Case study content
    └── cover.png        # Cover image
```

### Case Study Frontmatter

```yaml
---
title: 'Case Study Title'
subtitle: "Brief description of the project (1-2 sentences)"
client: 'Client Company Name'
pubDate: 2026-03-21      # Publication date
year: 2026              # Project year
category: 'Website Development'  # Must be one of the valid categories
services:               # List of services provided
    - 'Service 1'
    - 'Service 2'
stack:                  # Technologies used
    - 'Technology 1'
    - 'Technology 2'
image: '../../assets/case-studies/project-name/cover.png'  # Path to cover image
isPrivate: false        # Set to true to hide from public
link: 'https://live-project.com'  # Optional: Live project URL
---
```

### Valid Categories

- `Website Development`
- `E-Commerce`
- `AI Automation`
- `Mobile Development`
- `Software Development`

### Creating a New Case Study

1. **Create the directory structure**

```bash
mkdir -p src/content/case-studies/project-name
mkdir -p src/assets/case-studies/project-name
```

2. **Prepare assets**

   Place all images in `src/assets/case-studies/project-name/`:
   - `cover.png` - Main cover image (required)
   - Additional screenshots/images as needed

3. **Create the MDX file**

   Create `src/content/case-studies/project-name.mdx` or `src/content/case-studies/project-name/index.mdx`:

````mdx
---
title: 'Project Name: Transforming Digital Presence'
subtitle: "How we helped Client Inc. achieve 200% growth through strategic web development and UX improvements."
client: 'Client Inc.'
pubDate: 2026-03-21
year: 2026
category: 'Website Development'
services: 
    - 'Website Design'
    - 'UI/UX Design'
    - 'Performance Optimization'
    - 'SEO Strategy'
stack: [
    'Astro',
    'React',
    'Tailwind CSS',
    'Node.js'
]
image: '../../assets/case-studies/project-name/cover.png'
isPrivate: false
link: 'https://client-website.com'
---

{/* Imports */}
import { Image } from 'astro:assets';
import cover from '../../assets/case-studies/project-name/cover.png';
import screenshot1 from '../../assets/case-studies/project-name/screenshot1.png';

{/* Content */}

# Project Overview

Begin with a compelling introduction that explains the project context and goals.

## The Challenge

Describe the client's pain points and what they needed to solve.

## Our Solution

Detail the approach and solution implemented.

### Key Features

- Feature 1 with explanation
- Feature 2 with explanation
- Feature 3 with explanation

## Results

Share measurable outcomes and achievements.

> "Quote from the client about the project success."
> — Client Name, Position

## Technical Implementation

```typescript
// Code examples if relevant
const implementation = {
    framework: 'Astro',
    performance: '99/100 Lighthouse'
};
```
````

## Conclusion

Wrap up with lessons learned and next steps.

### MDX Components Available

| Component | Usage |
|-----------|-------|
| `<Image />` | Display images with Astro's optimized Image component |
| `# Heading` | H1 headings (use once at top) |
| `## Heading` | H2 section headings |
| `### Heading` | H3 subsection headings |
| `> Quote` | Blockquotes for testimonials |
| `` `code` `` | Inline code |
| ` ```lang ` | Code blocks with syntax highlighting |
| `**bold**` | Bold text |
| `*italic*` | Italic text |
| `[Link](url)` | Links |
| `- Item` | Unordered lists |
| `1. Item` | Ordered lists |

### Asset Guidelines for Case Studies

| Asset Type | Dimensions | Format | Max Size | Location |
|------------|------------|--------|----------|----------|
| Cover Image | 1920x1080px | PNG/WebP | 1MB | `src/assets/case-studies/{project}/` |
| Screenshots | 1920x1080px | PNG | 500KB | `src/assets/case-studies/{project}/` |
| Icons/Logos | 512x512px | SVG/PNG | 100KB | `src/assets/logos/` |

### Complete Example

See `src/content/case-studies/example.mdx` for a full working example with all available features.

---

## Asset Management

### Directory Structure

```
src/assets/
├── case-studies/         # Case study assets (organized by project)
│   └── project-name/
│       ├── cover.png
│       └── screenshot1.png
├── fonts/               # Custom fonts
├── images/              # General images
├── logos/              # Client logos
└── works/              # Portfolio/featured project images
```

### Image Optimization Guidelines

1. **Use appropriate formats:**
   - Photos: WebP (with PNG fallback)
   - Graphics/Logos: SVG (vector) or PNG
   - Icons: SVG

2. **Optimize before adding:**
   ```bash
   # Using ImageMagick
   convert image.jpg -quality 85 -strip image.webp
   
   # Using Squoosh (https://squoosh.app)
   # Web UI for manual optimization
   ```

3. **Naming conventions:**
   - Use lowercase with hyphens: `project-screenshot.png`
   - No spaces or special characters
   - Be descriptive: `dashboard-mobile-view.png`

4. **Maximum file sizes:**
   - Cover images: 1MB
   - Screenshots: 500KB
   - Logos: 100KB
   - Icons: 50KB

### Adding Assets

1. Place images in the appropriate directory
2. Import in your file: `import image from '../assets/path/to/image.png'`
3. Use with Astro Image component for optimization

---

## Best Practices

### Content Quality

- **Be specific** - Include concrete numbers, metrics, and results
- **Keep it scannable** - Use headings, lists, and short paragraphs
- **Show, don't tell** - Use images to demonstrate work
- **Proofread** - Check for spelling and grammar errors
- **Update regularly** - Keep content fresh and current

### SEO Considerations

- Include relevant keywords in titles and content
- Use descriptive alt text for all images
- Keep URLs lowercase with hyphens
- Write compelling meta descriptions (in subtitle)

### Performance

- Optimize all images before committing
- Use WebP format when possible
- Keep case studies focused (aim for 800-1500 words)
- Test mobile rendering before publishing

### Version Control

- Create a new branch for content updates: `git checkout -b content/case-study-{project-name}`
- Commit with clear messages: `content: add case study for Project Name`
- Include images in the same commit as the content
- Test locally before pushing

### Review Process

1. Write content locally
2. Preview with `bun run dev`
3. Check all links and images
4. Review on mobile and desktop
5. Commit and push
6. Create PR if required by team workflow
7. Deploy after approval

---

## Quick Reference

### File Locations

| Content Type | File Path |
|--------------|-----------|
| Reviews | `src/lib/reviews.ts` |
| Showcased Projects | `src/lib/showcased.ts` |
| Featured Projects | `src/lib/featured.ts` |
| Case Studies | `src/content/case-studies/*.mdx` |
| Company Values | `src/lib/values.ts` |

### Common Tasks

**Add a new review:**
```bash
# Edit src/lib/reviews.ts
# Add object to reviews array
```

**Add a new project:**
```bash
# Add image to src/assets/works/
# Edit src/lib/featured.ts or src/lib/showcase.ts
# Import image and add to array
```

**Create a case study:**
```bash
# Create directory: mkdir -p src/content/case-studies/project-name
# Add assets to src/assets/case-studies/project-name/
# Create src/content/case-studies/project-name.mdx
# Add frontmatter and content
```

### Need Help?

- Check existing files in the repository for examples
- Refer to the [Astro documentation](https://docs.astro.build)
- Review the [MDX documentation](https://mdxjs.com)
- Contact the development team

---

## Deployment

After making content changes:

1. **Test locally**
   ```bash
   bun run dev
   ```

2. **Build for production**
   ```bash
   bun run build
   ```

3. **Deploy**
   - Changes are automatically deployed via Dokploy
   - Or manually deploy the `dist/` folder

---

<p align="center">Last updated: March 2026</p>
