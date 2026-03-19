import groundsph from '../assets/works/groundsph.png'
import palms from '../assets/works/palms-agency-global.png'
import serialkitten from '../assets/works/serialkitten.png'

export interface FeaturedProject {
    title: string,
    image: typeof groundsph,
    tags: string[],
    link?: string
}

export const featuredProjects: FeaturedProject[] = [
    {
        title: "Grounds.ph",
        image: groundsph,
        tags: ["Website", "UI/UX Design"],
        link: "https://grounds.ph"
    },
    {
        title: "Palms Agency Global",
        image: palms,
        tags: ["Website", "UI/UX Design"],
        link: "https://palms-agency-global.com"
    },
    {
        title: "Serial Kitten",
        image: serialkitten,
        tags: ["Website", "UI/UX Design"],
        link: "https://serialkitten.com"
    }
]