import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <section className="relative flex min-h-[fit] flex-col items-center">
            <div className="h-[10rem] w-full overflow-hidden bg-gradient-to-t from-primary-30 to-transparent">
                <div className="absolute" />
                <img src="grid.svg" alt="DEVGO Logo" className="footer-grid-clip w-full opacity-10" />
            </div>
            <div className="relative flex w-full flex-col items-center justify-end gap-4 bg-black px-4 py-8 md:px-[10svw]">
                <img
                    src="logo.svg"
                    alt="DEVGO Logo"
                    className="absolute left-[5svw] top-8 hidden h-[8rem] opacity-10 md:block"
                />
                <div className="flex justify-center gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <p className="text-sm font-semibold">FOLLOW US</p>
                            <Link href={'https://facebook.com'}>
                                <Facebook className="h-4 w-4 transition-colors hover:stroke-secondary" />
                            </Link>
                            <Link href={'https://x.com'}>
                                <Twitter className="h-4 w-4 transition-colors hover:stroke-secondary" />
                            </Link>
                            <Link href={'https://linkedin.com'}>
                                <Linkedin className="h-4 w-4 transition-colors hover:stroke-secondary" />
                            </Link>
                            <Link href={'https://instagram.com'}>
                                <Instagram className="h-4 w-4 transition-colors hover:stroke-secondary" />
                            </Link>
                        </div>
                        <div className="flex gap-4">
                            <p className="text-sm font-semibold">EMAIL</p>

                            <p className="text-sm text-text-30">studiodevgo@gmail.com</p>
                        </div>
                    </div>
                    <div className="hidden flex-col gap-2 md:flex">
                        <p className="text-sm font-semibold">NAVIGATE</p>
                        <Link href={'/'} className="text-sm text-text-30 transition-colors hover:text-text">
                            Home
                        </Link>
                        <Link href={'/#services'} className="text-sm text-text-30 transition-colors hover:text-text">
                            Services
                        </Link>
                        <Link href={'/#portfolio'} className="text-sm text-text-30 transition-colors hover:text-text">
                            Portfolio
                        </Link>
                        <Link href={'/#team'} className="text-sm text-text-30 transition-colors hover:text-text">
                            Team
                        </Link>
                        <Link href={'/#contact'} className="text-sm text-text-30 transition-colors hover:text-text">
                            Contact Us
                        </Link>
                    </div>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent from-10% via-primary to-transparent to-90%" />
                <small className="text-text-30">
                    Copyright &copy; {new Date().getFullYear()} DEVGO Studio. All Rights Reserved.
                </small>
            </div>
        </section>
    )
}
