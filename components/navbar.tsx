'use client'

import { Divide, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar({ children }: { children?: React.ReactNode }) {
    const [menu, setMenu] = useState(false)

    const setBg = (trig: boolean) => {
        if (trig == true) {
            return 'bg-background'
        }
        return 'bg-background-30'
    }

    return (
        <nav
            className={
                'sticky top-0 z-10 flex min-w-full items-center justify-between px-4 py-4 backdrop-blur-sm md:px-[5svw] transition-colors duration-300' +
                ' ' +
                setBg(menu)
            }
        >
            <Link href={'/'} className="text-2xl font-semibold uppercase tracking-widest text-primary">
                devgo
            </Link>
            <div className="group hidden gap-8 md:flex">{children}</div>
            <Menu className="cursor-pointer md:hidden" onClick={() => setMenu(!menu)} />
            <AnimatePresence>
                {menu && (
                    <motion.div
                        className="absolute left-0 top-[100%] -z-10 flex w-full flex-col items-center gap-4 bg-background px-4 py-8"
                        initial={{ x: '100%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'keyframes', duration: 0.3 }}
                        onClick={() => setMenu(false)}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <Link
            href={href}
            className="font-medium transition-colors duration-300 hover:!text-primary active:text-primary-30 group-hover:text-text-30"
        >
            {children}
        </Link>
    )
}
