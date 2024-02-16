'use client'

import Link from 'next/link'
import styles from './nav.module.css'
import { useState } from 'react'
import { BarsIcon } from '@/utils/icons'

export default function Navbar() {

    const [mobile, setMobile] = useState(false)

    return (
        <>
            <nav className={styles.navbar}>
                <Link href={'/'} className={styles.logo}><h5><span>D E V</span> G O</h5></Link>
                <div className={styles.right}>
                    <Link href={'/#top'}>Home</Link>
                    <Link href={'/#team'}>Team</Link>
                    <Link href={'/#contact'}>
                        <button type='button'>
                            Contact Us
                        </button>
                    </Link>
                </div>
                <div className={styles.mobile} onClick={() => setMobile(!mobile)}>
                    <BarsIcon className={styles.bars} />
                </div>
            </nav>

            <div className={mobile ? styles.sidebar_active : styles.sidebar}>
                <Link href={'/#top'} onClick={() => setMobile(!mobile)}>Home</Link>
                <Link href={'/#team'} onClick={() => setMobile(!mobile)}>Team</Link>
                <Link href={'/#contact'} onClick={() => setMobile(!mobile)}>Contact Us</Link>
            </div>
        </>

    )
}