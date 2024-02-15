'use client'

import Link from 'next/link'
import styles from './nav.module.css'

export default function Navbar() {

    return (
        <nav className={styles.navbar}>
            <Link href={'/'} className={styles.logo}><h5><span>D E V</span> G O</h5></Link>
            <div className={styles.right}>
                <Link href={'/#top'}>Home</Link>
                <Link href={'/#team'}>Team</Link>
                <Link href={'/#previous'}>Previous Work</Link>
                <Link href={'/#contact'}>
                    <button type='button'>
                        Contact Us
                    </button>
                </Link>
            </div>
        </nav>
    )
}