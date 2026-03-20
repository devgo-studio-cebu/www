import groundsph from '../assets/works/groundsph.png'
import palms from '../assets/works/palms-agency-global.png'
import serialkitten from '../assets/works/serialkitten.png'

export interface Project {
    title: string
    image: typeof groundsph
    url: string
}

export const projects: Project[] = [
    {
        title: "Grounds.ph",
        image: groundsph,
        url: "https://grounds.ph"
    },
    {
        title: "Palms Agency Global",
        image: palms,
        url: "https://palms-agency-global.com"
    },
    {
        title: "Serial Kitten",
        image: serialkitten,
        url: "https://serialkitten.com"
    }
]