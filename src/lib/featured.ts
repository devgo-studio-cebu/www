import hopethreadsImg from '../assets/works/hopethreads.png'
import palmsImg from '../assets/works/palms-agency-global.png'
import wildRoundsImg from '../assets/works/wild-rounds-pilipinas-open.png'

export interface FeaturedProject {
    title: string
    image: typeof hopethreadsImg
    tags: string[]
    link?: string
}

// NOTE: When the content collection supports image fields, this should derive
// from getCollection("case-studies") instead. For now, this is the single
// manifest for homepage featured projects.
export const featuredProjects: FeaturedProject[] = [
    {
        title: "Wild Rounds Pilipinas Open",
        image: wildRoundsImg,
        tags: ["Website", "Event", "UI/UX Design"],
        link: "https://wildroundspilipinasopen.com",
    },
    {
        title: "Hopethreads",
        image: hopethreadsImg,
        tags: ["Website", "Store", "UI/UX Design"],
        link: "https://hopethreads.au",
    },
    {
        title: "Palms Agency Global",
        image: palmsImg,
        tags: ["Website", "UI/UX Design"],
        link: "https://palms-agency-global.com",
    },
]