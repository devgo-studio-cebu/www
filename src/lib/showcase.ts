import groundsph from '../assets/works/groundsph.png'
import palms from '../assets/works/palms-agency-global.png'
import serialkitten from '../assets/works/serialkitten.png'

export interface Project {
    title: string
    image: typeof groundsph
    url?: string
    year: number
}

export const projects: Project[] = [
    {
        title: "Grounds.ph",
        image: groundsph,
        url: "https://grounds.ph",
        year: 2026
    },
    {
        title: "Palms Agency Global",
        image: palms,
        url: "https://palms-agency-global.com",
        year: 2025
    },
    {
        title: "Serial Kitten",
        image: serialkitten,
        url: "https://serialkitten.com",
        year: 2024
    }
]