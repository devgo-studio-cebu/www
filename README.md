# DEVGO Studio Website

[![Version](https://img.shields.io/badge/version-2026.1.2-blue)](https://github.com/your-org/www)
[![Astro](https://img.shields.io/badge/Astro-6.1.4-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Dokploy](https://img.shields.io/badge/Deployed%20on-Dokploy-2563EB?logo=docker)](https://dokploy.com)

The official website for DEVGO Studio - a creative software development and digital marketing agency based in the Philippines. This site showcases our portfolio, case studies, client reviews, and services.

## Table of Contents

- [Project Details](#project-details)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Content Management](#content-management)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Project Details

**Project Name:** DEVGO Studio Website  
**Version:** 2026.1.2
**Live URL:** https://test.devgo.studio  
**Repository:** https://github.com/devgo-studi-cebu/www

### What We Do

DEVGO Studio is a full-service digital agency specializing in:

- **Website Development** - Modern, performant web applications
- **E-Commerce Solutions** - Online stores with seamless checkout experiences
- **AI Automation** - Intelligent automation for business workflows
- **Mobile Development** - Cross-platform mobile applications
- **Software Development** - Custom software solutions
- **UI/UX Design** - Beautiful, user-centered design
- **Digital Marketing** - SEO, content strategy, and growth marketing

### Key Features

- **Portfolio Showcase** - Display of past projects and work samples
- **Case Studies** - Detailed project breakdowns with client stories
- **Client Reviews** - Testimonials from satisfied clients
- **Services Overview** - Comprehensive service offerings
- **SEO Optimized** - Full SEO implementation with sitemaps and meta tags
- **Performance First** - Static site generation for optimal loading speeds
- **Responsive Design** - Mobile-first approach with Tailwind CSS

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| [Astro](https://astro.build) | 6.1.2 | Static site generator & framework |
| [TypeScript](https://typescriptlang.org) | 5.x | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first CSS framework |
| [Bun](https://bun.sh) | 1.2 | Fast JavaScript runtime & package manager |

### Frontend Libraries

| Library | Purpose |
|---------|---------|
| [anime.js](https://animejs.com) | JavaScript animations |
| [Pixi.js](https://pixijs.com) | 2D WebGL graphics & effects |
| [Lucide Icons](https://lucide.dev) | Beautiful icon library |

### Astro Integrations

| Integration | Purpose |
|-------------|---------|
| [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) | Markdown/MDX content support |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | Automatic sitemap generation |

### Typography

| Font | Source |
|------|--------|
| Monument Extended | Custom display font (Regular & Ultrabold) |
| Montserrat | Google Fonts (Variable) |

### Infrastructure

| Service | Purpose |
|---------|---------|
| [Dokploy](https://dokploy.com) | Self-hosted deployment platform |
| [Docker](https://docker.com) | Containerization |
| [Nginx](https://nginx.org) | Web server & reverse proxy |

---

## Getting Started

### Prerequisites

- **Node.js** 20+ or **Bun** 1.2+
- **Git** for version control
- **Docker** (optional, for production builds)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/devgo/www.git
cd www
```

2. **Install dependencies**

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

3. **Start development server**

```bash
bun run dev
```

The site will be available at `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with hot reload |
| `bun run build` | Build for production (outputs to `dist/`) |
| `bun preview` | Preview production build locally |
| `bun astro` | Astro CLI commands |

---

## Architecture

### Directory Structure

```
├── src/
│   ├── assets/
│   │   ├── fonts/          # Custom fonts (Monument Extended)
│   │   ├── images/         # Image assets
│   │   ├── logos/          # Client logos
│   │   └── works/          # Portfolio project images
│   ├── components/
│   │   ├── case-study/     # Case study components
│   │   ├── landing/        # Landing page sections
│   │   ├── navbar.astro    # Navigation component
│   │   ├── footer.astro    # Footer component
│   │   └── seo.astro       # SEO meta tags component
│   ├── content/
│   │   └── case-studies/   # MDX case study content files
│   ├── layouts/
│   │   └── BaseLayout.astro # Base HTML layout
│   ├── lib/
│   │   ├── featured.ts     # Featured projects data
│   │   ├── reviews.ts      # Client reviews data
│   │   ├── showcase.ts     # Showcased projects data
│   │   └── values.ts       # Company values data
│   ├── pages/
│   │   ├── index.astro     # Homepage
│   │   ├── showcase.astro  # Portfolio showcase
│   │   ├── case-studies/   # Case studies list & detail pages
│   │   └── llms.txt.ts     # LLM training data endpoint
│   ├── styles/
│   │   └── global.css      # Global styles & Tailwind imports
│   └── utils/
│       └── seo.ts          # SEO utilities
├── public/
│   └── favicon.svg         # Static assets
├── docs/
│   ├── seo-maintenance.md  # SEO maintenance guide
│   ├── plans/              # Planning documents
│   └── CONTRIBUTING.md     # Content management guide
├── astro.config.mjs        # Astro configuration
├── Dockerfile              # Docker build configuration
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies
└── tsconfig.json          # TypeScript configuration
```

### Content Collections

The site uses Astro's Content Collections for type-safe content management:

**Case Studies** (`src/content/case-studies/`)
- Schema defined in `src/content.config.ts`
- MDX format with frontmatter
- Supports images, code blocks, and rich content
- Categories: Website Development, E-Commerce, AI Automation, Mobile Development, Software Development

### Data Files

Static data is stored in `src/lib/`:

| File | Purpose | Location |
|------|---------|----------|
| `reviews.ts` | Client testimonials | `src/lib/reviews.ts` |
| `featured.ts` | Featured projects | `src/lib/featured.ts` |
| `showcase.ts` | Showcased projects | `src/lib/showcase.ts` |
| `values.ts` | Company values | `src/lib/values.ts` |

---

## Content Management

Managing content like reviews, projects, and case studies is documented in the [Content Management Guide](docs/CONTRIBUTING.md).

Quick links:
- [Managing Reviews](docs/CONTRIBUTING.md#managing-reviews)
- [Managing Showcased Projects](docs/CONTRIBUTING.md#managing-showcased-projects)
- [Managing Featured Projects](docs/CONTRIBUTING.md#managing-featured-projects)
- [Creating Case Studies](docs/CONTRIBUTING.md#creating-case-studies)

---

## Deployment

### Deployed on Dokploy

This project is deployed using [Dokploy](https://dokploy.com) - a self-hosted deployment platform.

**Live Site:** https://devgo.studio

### Docker Deployment

The project includes a multi-stage Dockerfile for optimized production builds:

```bash
# Build the Docker image
docker build -t devgo-studio .

# Run the container
docker run -p 8080:80 devgo-studio
```

### Manual Deployment

1. **Build for production**

```bash
bun run build
```

2. **Deploy the `dist/` folder** to your hosting provider

The `dist/` folder contains the static files ready for deployment.

### Nginx Configuration

The included `nginx.conf` provides:
- SPA routing support (404 fallback to index.html)
- Asset caching (1 year for static files)
- Gzip compression
- Security headers

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for detailed instructions on:

- Content management workflows
- Code style guidelines
- Submitting changes
- Review process

---

## License

Copyright © 2026 DEVGO Studio. All rights reserved.

---

## Contact

- **Website:** https://devgo.studio
- **Email:** official@devgo.studio
- **Location:** Philippines

---

<p align="center">Built with ❤️ by DEVGO Studio</p>
