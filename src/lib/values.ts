interface Links {
    name: string
    extra?: string
    url: string
}

export const links: Links[] = [
    {
        name: "Home",
        url: "#top"
    },
    {
        name: "Showcase",
        extra: "14",
        url: "#showcase"
    },
    {
        name: "Reviews",
        extra: "6",
        url: "#reviews"
    },
    {
        name: "Case Studies",
        extra: "14",
        url: "#case-studies"
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
        url: "https://www.github.com/devgostudio"
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/devgostudio"
    },
]

import { AppWindow, Bot, Briefcase, Code, ShoppingCart } from 'lucide-astro'

interface Services {
    title: string
    icon: typeof Briefcase
    description: string
}

export const services: Services[] = [
    {
        title: "Portfolio Sites",
        icon: Briefcase,
        description: "Showcase your work with a stunning portfolio website."
    },
    {
        title: "E-commerce Stores",
        icon: ShoppingCart,
        description: "Launch your online store with a sleek and user-friendly design."
    },
    {
        title: "Dynamic Web Apps",
        icon: AppWindow,
        description: "Build interactive web applications tailored to your needs."
    },
    {
        title: "AI Automation",
        icon: Bot,
        description: "Integrate AI to automate tasks and enhance user experience."
    },
    {
        title: "Software & Mobile",
        icon: Code,
        description: "Develop custom software and mobile applications to bring your ideas to life."
    }
]