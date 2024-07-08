import { ContactSection, HeroSection, ServicesSection } from '@/components/landingPage'

export default function LandingPage() {
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
            <ContactSection />
        </>
    )
}
