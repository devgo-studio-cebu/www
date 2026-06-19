import hopethreadsImg from '../assets/works/hopethreads.png'
import palmsImg from '../assets/works/palms-agency-global.png'
import serialkittenImg from '../assets/works/serialkitten.png'
import wildRoundsImg from '../assets/works/wild-rounds-pilipinas-open.png'

export interface Project {
    title: string
    image: typeof hopethreadsImg
    url?: string
    year: number
}

// NOTE: When the content collection supports image fields, this should derive
// from getCollection("case-studies") instead. For now, this is the single
// manifest for showcase projects.
export const projects: Project[] = [
    {
        title: "Wild Rounds Pilipinas Open",
        image: wildRoundsImg,
        url: "https://wildroundspilipinasopen.com",
        year: 2026,
    },
    {
        title: "Hopethreads",
        image: hopethreadsImg,
        url: "https://hopethreads.au",
        year: 2026,
    },
    {
        title: "Palms Agency Global",
        image: palmsImg,
        url: "https://palms-agency-global.com",
        year: 2025,
    },
    {
        title: "Serial Kitten",
        image: serialkittenImg,
        url: "https://serialkitten.com",
        year: 2024,
    },
]