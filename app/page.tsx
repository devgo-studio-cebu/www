import Link from 'next/link'
import styles from './landing.module.css'
import Members from '@/components/modules/team'
import Contact from '@/components/modules/contact'
import Image from 'next/image'

import CompanyLogo from '@/public/logo.svg'
import { teamProfile } from '@/utils/teamProfile'

export default function LandingPage() {
    return (
        <>
            <section id="top" className={styles.main}>
                <div className={styles.main_left}>
                    <h1>DEVGO</h1>
                    <h4>A web development studio based in Cebu</h4>
                    <h5>Building your websites to reality.</h5>
                    <Link href={'/#contact'}>
                        <button type="button">Contact Us</button>
                    </Link>
                </div>
                <div className={styles.main_right}>
                    <Image src={CompanyLogo} alt="CompanyLogo" />
                    <div />
                </div>
            </section>
            <section id="team" className={styles.team}>
                <div className={styles.team_top}>
                    <h1>Meet the Team</h1>
                    <h5>So you can know us better.</h5>
                </div>
                <div className={styles.team_bottom}>
                    <Members members={teamProfile} />
                </div>
            </section>
            <section id="contact" className={styles.contact}>
                <div className={styles.contact_top}>
                    <h1>Contact Us</h1>
                    <h5>And we'll contact you back.</h5>
                </div>
                <div className={styles.contact_bottom}>
                    <Contact />
                </div>
            </section>
        </>
    )
}
