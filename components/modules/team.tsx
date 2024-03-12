import Image from 'next/image'
import styles from './team.module.css'
import Link from 'next/link'

import { motion } from 'framer-motion'

export type members = {
    name: string
    img: string
    role: string
    description?: string
    social?: { title: string; link: string }
}[]

export default function Members({ members }: { members: members }) {
    return (
        <>
            {members.map((data, index) => (
                <motion.div
                    key={index}
                    className={styles.member}
                    initial={{ opacity: '0%' }}
                    whileInView={{ opacity: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <Image src={`/team/${data.img}`} width={450} height={450} alt={`picture of ${data.name}`} />
                    <h5>{data.name}</h5>
                    <h5>{data.role}</h5>
                    {data.social && (
                        <span>
                            <Link href={data.social.link}>{data.social.title}</Link>
                        </span>
                    )}
                    <p>{data.description}</p>
                </motion.div>
            ))}
        </>
    )
}
