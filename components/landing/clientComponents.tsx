'use client'
import styles from '@/app/landing.module.css'
import { inView, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import CompanyLogo from '@/public/logo.svg'
import { useEffect } from 'react'
import Members from '../modules/team'
import { teamProfile } from '@/utils/teamProfile'
import Contact from '../modules/contact'

export function MainHeading({ title, desc, tagline }: { title: string, desc: string, tagline: string }) {

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={styles.main_left}>
                <motion.h1
                    initial={{ opacity: '0%' }}
                    animate={{ opacity: '100%' }}
                    transition={{ delay: 0.1 }}
                >{title}</motion.h1>
                <motion.h4
                    initial={{ opacity: '0%' }}
                    animate={{ opacity: '100%' }}
                    transition={{ delay: 0.2 }}
                >{desc}</motion.h4>
                <motion.h5
                    initial={{ opacity: '0%' }}
                    animate={{ opacity: '100%' }}
                    transition={{ delay: 0.3 }}
                >{tagline}</motion.h5>
                <Link href={'/#contact'}>
                    <motion.button
                        initial={{ opacity: '0%' }}
                        animate={{ opacity: '100%' }}
                        transition={{ delay: 0.4 }}
                        type="button"
                    >Contact Us</motion.button>
                </Link>
            </div>
            <motion.div
                className={styles.main_right}
            >
                <Image src={CompanyLogo} alt="CompanyLogo" />
                <div />
            </motion.div>
        </>
    )
}

export function TeamSection() {

    return (
        <>
            <div className={styles.team_top}>
                <motion.h1
                    initial={{ opacity: '0%' }}
                    whileInView={{ opacity: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Meet the Team</motion.h1>
                <motion.h5
                    initial={{ opacity: '0%' }}
                    whileInView={{ opacity: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    So you can know us better.</motion.h5>
            </div>
            <div className={styles.team_bottom}>
                <Members members={teamProfile} />
            </div>
        </>
    )
}

export function ContactSection() {
    return (
        <>
            <div className={styles.contact_top}>
                <motion.h1
                    initial={{ opacity: '0%' }}
                    whileInView={{ opacity: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Contact Us</motion.h1>
                <motion.h5
                    initial={{ opacity: '0%' }}
                    whileInView={{ opacity: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    And we'll contact you back.
                </motion.h5>
            </div>
            <motion.div
                initial={{ opacity: '0%' }}
                whileInView={{ opacity: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className={styles.contact_bottom}
            >
                <Contact />
            </motion.div>
        </>
    )
}