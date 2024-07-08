import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

import consMeta from '@/utils/metadata'
import Navbar, { NavLink } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = consMeta()

const mont = Montserrat({ subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className='bg-background overflow-x-hidden'>
            <body className={mont.className + ' relative overflow-x-hidden bg-background text-text'}>
                <Navbar>
                    <NavLink href="/#about">About Us</NavLink>
                    <NavLink href="/#services">Services</NavLink>
                    <NavLink href="/#portfolio">Portfolio</NavLink>
                    <NavLink href="/#contact">Contact Us</NavLink>
                </Navbar>
                {children}
                <Footer />
            </body>
        </html>
    )
}
