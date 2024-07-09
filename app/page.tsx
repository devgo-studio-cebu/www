import {
    ClientSection,
    ContactSection,
    HeroSection,
    PortfolioSection,
    ServicesSection,
    TeamSection,
} from '@/components/landingPage'

export default async function LandingPage() {
    return (
        <>
            <HeroSection>
                A Cebu-based digital solutions studio specializing in web development and innovative digital solutions.
                Our team crafts bespoke websites that drive engagement, conversion, and growth. Let's bring your vision
                to life in the digital realm.
            </HeroSection>
            <ServicesSection
                service={[
                    {
                        title: 'Digital Solutions',
                        items: [
                            'UI/UX',
                            'Website Development',
                            'E-Commerce',
                            'Mobile Development',
                            'Domains',
                            'Hosting',
                        ],
                        button: '/#contact',
                    },
                    {
                        title: 'Visual Identity',
                        items: ['Brand Design', 'Logo Design', 'Graphics Illustration', 'Basic 3D Product Modelling'],
                        button: '/#contact',
                    },
                ]}
            >
                Check out what we offer. You might just be interested and maybe we could start working together!
            </ServicesSection>
            <PortfolioSection
                projects={[
                    {
                        name: 'KLBHS',
                        logo: klbhs,
                        date: 'February 28, 2024',
                        desc: 'A Cebu Based Creative Studio',
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
                ]}
            />
            <ClientSection clients={['ajsneaks', 'dermadoc', 'islandvibes', 'klbhs', 'serialkitten', 'sync2va']} />
            <TeamSection
                members={[
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
                        skills: ['css', 'html', 'react', 'typescript', 'nextjs','tailwind', 'framer'],
                    },
                    {
                        image: stanlee,
                        name: 'Stanlee Achumbre',
                        role: 'INSERT',
                    },
                    {
                        image: julz,
                        name: 'Julz Cortes',
                        role: 'Frontend Developer',
                        skills: ['react', 'html', 'css', 'js', 'mysql', 'tailwind'],
                    },
                    {
                        image: bessa,
                        name: 'Bessa Nicole',
                        role: 'INSERT',
                    },
                    {
                        image: achille,
                        name: 'Achille Lanutan',
                        role: 'INSERT',
                    },
                    {
                        image: carlo,
                        name: 'Jan Carlo Juab',
                        role: 'Backend Developer',
                    },
                ]}
            />
            <ContactSection />
        </>
    )
}

// Member imports
import adrian from '@/public/members/adrian.webp'
import achille from '@/public/members/achille.webp'
import bessa from '@/public/members/bessa.webp'
import julz from '@/public/members/julz.webp'
import stanlee from '@/public/members/stanlee.webp'
import carlo from '@/public/members/carlo.webp'

import klbhs from '@/public/logos/klbhs.webp'
import serialkitten from '@/public/logos/serialkitten.webp'
import sync2va from '@/public/logos/sync2va.webp'
import klbhs_preview from '@/public/placeholders/klbhs-preview.webp'
import serialkitten_preview from '@/public/placeholders/serialkitten-preview.webp'
import sync2va_preview from '@/public/placeholders/sync2va-preview.webp'
