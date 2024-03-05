import styles from './landing.module.css'

import { ContactSection, MainHeading, TeamSection } from '@/components/landing/clientComponents'

export default function LandingPage() {
    return (
        <>
            <section id="top" className={styles.main}>
                <MainHeading
                    title='DEVGO'
                    desc='A web development studio based in Cebu'
                    tagline='Building your websites to reality.'
                />
            </section>
            <section id="team" className={styles.team}>
                <TeamSection />
            </section>
            <section id="contact" className={styles.contact}>
                <ContactSection />
            </section>
        </>
    )
}
