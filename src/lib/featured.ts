import hopethreads from '../assets/works/hopethreads.png'
import palms from '../assets/works/palms-agency-global.png'
import serialkitten from '../assets/works/serialkitten.png'

export interface FeaturedProject {
    title: string,
    image: typeof hopethreads,
    tags: string[],
    link?: string
}

export const featuredProjects: FeaturedProject[] = [
    {
        title: "Hopethreads",
        image: hopethreads,
        tags: ["Website", "Store", "UI/UX Design"],
        link: "https://hopethreads.au"
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