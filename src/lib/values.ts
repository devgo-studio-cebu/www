interface Links {
    name: string
    extra?: string
    url: string
}

export const links: Links[] = [
    {
        name: "Home",
        url: "#hero"
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
        name: "Contact Us",
        url: "#contact"
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