export interface Review {
    name: string
    company: string
    review: string
    link?: string
}

export const reviews: Review[] = [
    {
        name: "Julienne Sombrio",
        company: "(Placeholder) Derma Doc Skin Specialist",
        review: "DEVGO Studio has been an invaluable partner in our digital transformation journey. Their expertise in web development and design has helped us create a stunning online presence that truly reflects our brand. The team is responsive, professional, and always goes the extra mile to ensure our satisfaction. We highly recommend DEVGO Studio for any business looking to elevate their digital presence.",
        link: "https://dermadocskinspecialist.com"
    },
    {
        name: "Marcus Chen",
        company: "(Placeholder) TechFlow Solutions",
        review: "Working with DEVGO Studio was a game-changer for our startup. They understood our vision immediately and delivered a modern, user-friendly website that exceeded our expectations. Their attention to detail and commitment to quality is exceptional. Highly recommended!",
        link: "https://techflowsolutions.io"
    },
    {
        name: "Sarah Mitchell",
        company: "(Placeholder) Wellness & Co",
        review: "DEVGO Studio transformed our outdated website into a beautiful, functional platform. The team was collaborative, patient, and delivered everything on time. They've been instrumental in helping us grow our online customer base. We couldn't be happier with the results."
    }
]