import { Member } from '@/components/landingPage'

export const teamProfile: Member[] = [
    {
        image: adrian,
        name: 'Adrian Bonpin',
        role: 'Frontend Developer',
        socials: {
            fb: 'https://facebook.com/adrianbonpin',
            x: 'https://x.com/adrianbonpin',
            li: 'https://linkedin.com/adrianbonpin',
            in: 'https://instagram.com/adrianbonpin',
        },
        skills: ['css', 'html', 'react', 'typescript', 'nextjs', 'tailwind', 'framer-motion'],
    },
    {
        image: julz,
        name: 'Julz Cortes',
        role: 'Frontend Developer',
        skills: ['react', 'html', 'css', 'javascript', 'mysql', 'tailwind'],
    },
    {
        image: neal,
        name: 'Neal Andrew Peteros',
        role: 'Backend Developer',
        skills: ['html', 'css', 'tailwind', 'php', 'mysql', 'javascript', 'typescript', 'react', 'nextjs'],
        socials: {
            fb: 'https://www.facebook.com/peterosneal',
            li: 'https://www.linkedin.com/in/neal-peteros-02a164275/',
        },
    },
    {
        image: stanlee,
        name: 'Stanlee Achumbre',
        role: 'Project Manager',
        skills: ['html', 'css', 'php', 'mysql', 'javascript', 'react', 'nextjs'],
    },
    {
        image: bessa,
        name: 'Bessa Nicole',
        role: 'UI/UX',
        skills: ['figma'],
    },
    {
        image: achille,
        name: 'Achille Lanutan',
        role: 'Frontend Developer',
        skills: ['figma', 'html', 'css', 'javascript', 'tailwind', 'react'],
    },
]

// Member imports
import adrian from '@/public/members/adrian.webp'
import achille from '@/public/members/achille.webp'
import bessa from '@/public/members/bessa.webp'
import julz from '@/public/members/julz.webp'
import stanlee from '@/public/members/stanlee.webp'
import neal from '@/public/members/neal.webp'
