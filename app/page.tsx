import Link from "next/link";
import styles from "./landing.module.css";
import Members from "@/components/modules/team";

export default function LandingPage() {

  return (
    <>
      <section id="top" className={styles.main}>
        <div className={styles.main_left}>
          <h1>DEVGO</h1>
          <h4>A web development studio based in Cebu</h4>
          <h5>We develop your website to reality.</h5>
          <Link href={'/#contact'}>
            <button type="button">
              Contact Us
            </button>
          </Link>
        </div>
        <div className={styles.main_right}>

        </div>
      </section>
      <section id="team" className={styles.team}>
        <div className={styles.team_top}>
          <h1>Meet the Team</h1>
          <h5>Our team is ready to work on your next big project.</h5>
        </div>
        <div className={styles.team_bottom}>
          <Members members={[
            {
              name: 'Adrian Alfred C. Bonpin',
              img: 'adrian.webp',
              role: 'Full Stack Developer',
              description: 'Adrian is a technically adept and explorative developer passionate in the challenge of creating websites. His experienced in NextJS.',
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
        </div>
      </section>
      <section id="contact" className={styles.contact}>
        <div className={styles.contact_top}>
          <h1>Contact Us</h1>
        </div>
      </section>
    </>
  )
}