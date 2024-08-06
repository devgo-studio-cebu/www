import { Project } from '@/components/landingPage'

export const portfolioProjects: Project[] = [
    {
        name: 'KLBHS',
        logo: klbhs,
        date: 'February 28, 2024',
        desc: 'Cebu Based Creative Studio',
        preview: klbhs_preview,
        link: 'https://klbhs.com',
    },
    {
        name: 'Serial Kitten',
        logo: serialkitten,
        date: 'March 5, 2024',
        desc: 'Major Philippine Production Company',
        preview: serialkitten_preview,
        link: 'https://serialkitten.com',
    },
    {
        name: 'Sync2VA',
        logo: sync2va,
        date: 'May 7, 2024',
        desc: 'Virtual Assistant and Book Keeping Agency',
        preview: sync2va_preview,
        link: 'https://sync2va.com',
    },
]

import klbhs from '@/public/logos/klbhs.webp'
import serialkitten from '@/public/logos/serialkitten.webp'
import sync2va from '@/public/logos/sync2va.webp'
import klbhs_preview from '@/public/placeholders/klbhs-preview.webp'
import serialkitten_preview from '@/public/placeholders/serialkitten-preview.webp'
import sync2va_preview from '@/public/placeholders/sync2va-preview.webp'
