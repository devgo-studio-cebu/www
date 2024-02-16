import Link from "next/link";
import styles from "./landing.module.css";
import Members from "@/components/modules/team";
import Contact from "@/components/modules/contact";
import Image from "next/image";

import CompanyLogo from '../public/logo.svg'

export default function LandingPage() {

  return (
    <>
      <section id="top" className={styles.main}>
        <div className={styles.main_left}>
          <h1>DEVGO</h1>
          <h4>A web development studio based in Cebu</h4>
          <h5>Building your websites to reality.</h5>
          <Link href={'/#contact'}>
            <button type="button">
              Contact Us
            </button>
          </Link>
        </div>
        <div className={styles.main_right}>
          <Image
            src={CompanyLogo}
            alt="CompanyLogo"
          />
          <div />
        </div>
      </section>
      <section id="team" className={styles.team}>
        <div className={styles.team_top}>
          <h1>Meet the Team</h1>
          <h5>So you can know us better.</h5>
        </div>
        <div className={styles.team_bottom}>
          <Members members={[
            {
              name: 'Adrian Alfred C. Bonpin',
              img: 'adrian.webp',
              role: 'Full Stack Developer',
              description: 'A technically adept and explorative developer passionate in web development.',
              social: {
                link: 'https://instagram.com/adrianbonpin',
                title: '@adrianbonpin'
              }
            },
            {
              name: 'Jan Stanlee Achumbre',
              img: 'stanlee.webp',
              role: 'Full Stack Developer',
              description: 'Also known as Mikoto, He goes for adventure and the challenges ahead in the tech world',
              social: {
                link: 'https://www.instagram.com/mikotochefu',
                title: '@mikotochefu'
              }
            }
          ]} />
        </div>
      </section>
      <section id="previous" className={styles.work}>
        <div className={styles.work_top}>
          <h1>Our Work</h1>
          <h5>Because background is key.</h5>
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