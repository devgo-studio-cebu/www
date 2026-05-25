import { AppWindow, Bot, Globe, ShoppingCart, TabletSmartphone } from 'lucide-astro'
import { projects } from './showcase'
import { reviews } from './reviews'

const caseStudyFiles = import.meta.glob('/src/content/case-studies/*.{md,mdx}')
const caseStudyCount = Object.keys(caseStudyFiles).length

interface Links {
    name: string
    extra?: string
    url: string
}

export const links: Links[] = [
    {
        name: "Home",
        url: "/#top"
    },
    {
        name: "Reviews",
        extra: reviews.length.toString(),
        url: "/#reviews"
    },
    {
        name: "Case Studies",
        extra: `${caseStudyCount - 1}`,
        url: "/case-studies"
    },
    {
        name: "Showcase",
        extra: projects.length.toString(),
        url: "/showcase"
    },

    {
        name: "Dashboard",
        url: "https://dash.devgo.studio"
    },
    {
        name: "Contact Us",
        url: "mailto:official@devgo.studio"
    }
]

export const socials: Links[] = [
    {
        name: "Facebook",
        url: "https://www.facebook.com/devgostudio"
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/devgostudio"
    },
    {
        name: "Github",
        url: "https://github.com/devgo-studio-cebu"
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/devgo-studio/"
    },
]

interface Services {
    title: string
    icon: typeof Globe
    description: string
}

export const services: Services[] = [
    {
        title: "Website Development",
        icon: Globe,
        description: "High-performance websites and web applications for global businesses—optimized for speed, scalability, and SEO"
    },
    {
        title: "E-Commerce",
        icon: ShoppingCart,
        description: "Secure, scalable e-commerce platforms with conversion-focused design and seamless payment integrations"
    },
    {
        title: "AI Automation",
        icon: Bot,
        description: "AI-powered automation solutions that streamline operations, reduce costs, and improve efficiency at scale"
    },
    {
        title: "Mobile Development",
        icon: TabletSmartphone,
        description: "High-performing iOS and Android apps delivering seamless, scalable, and user-centric experiences"
    },
    {
        title: "Software Development",
        icon: AppWindow,
        description: "Custom software solutions for startups and enterprises—enabling digital transformation and scalable operations"
    },
]