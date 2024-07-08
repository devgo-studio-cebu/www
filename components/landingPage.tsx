'use client'
import Image from 'next/image'

import logo from '@/public/logo.svg'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SendMail } from '@/utils/serverActions'

export function HeroSection({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <section className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]">
                <div className="absolute left-0 top-0 -z-10 h-[10rem] w-full overflow-hidden bg-gradient-to-b from-primary-30 to-transparent">
                    <div className="absolute" />
                    <img src="grid.svg" alt="DEVGO Logo" className="grid-clip w-full opacity-10" />
                </div>
                <div className="flex w-full flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16">
                    <Image src={logo} alt="DEVGO Logo" className="w-[25%] md:w-[15%]" priority={true} />
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <h1 className="text-5xl font-semibold uppercase md:text-7xl">devgo</h1>
                        <h2 className="text-2xl font-normal text-text opacity-50 *:text-2xl *:text-primary md:text-4xl md:*:text-4xl">
                            <span>dev</span>elopment on the <span>go!</span>
                        </h2>
                    </div>
                </div>
            </section>
            <section
                id="about"
                className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]"
            >
                <div className="flex flex-col gap-4 px-4 md:max-w-2xl">
                    <p className="text-justify text-text-30">{children}</p>
                    <Link href={'/#contact'} className="hidden md:block">
                        <button
                            type="button"
                            className="radius w-full rounded-md bg-gradient-to-r from-primary to-secondary py-2 font-semibold shadow-[0_0_37px_0px] shadow-primary-30"
                        >
                            Let's Talk!
                        </button>
                    </Link>
                </div>
            </section>
        </>
    )
}

export function ServicesSection({
    children,
    service,
}: {
    children?: React.ReactNode
    service: {
        title: string
        items: string[]
        button: string
    }[]
}) {
    const [[cur, direction], setCur] = useState([0, 0])
    const paginate = (next: number) => {
        if (cur === service.length - 1 && next === 1) {
            setCur([0, next])
            return
        }
        if (cur === 0 && next === -1) {
            setCur([service.length - 1, next])
            return
        }
        setCur([cur + next, next])
    }
    const swipeThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }
    return (
        <section
            className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]"
            id="services"
        >
            <div className="flex max-w-2xl flex-col items-center gap-4">
                <h1 className="text-2xl text-primary md:text-4xl">Services</h1>
                <p className="hidden text-text-30 md:block">{children}</p>
            </div>
            <div className="mt-8 hidden min-w-full max-w-fit flex-row justify-start gap-8 p-4 md:flex md:justify-center">
                {service.map((service, idx) => (
                    <div
                        key={idx}
                        className="flex h-[30rem] w-svw flex-col items-center justify-between rounded-lg border-4 border-primary bg-gradient-to-b from-background to-primary-30 p-6 shadow-[0_0_80px_-5px] shadow-primary-30 md:w-[20rem]"
                    >
                        <div className="flex w-full flex-col items-center gap-8">
                            <h3 className="text-xl">{service.title}</h3>
                            <ul className="flex w-full flex-col gap-3">
                                {service.items.map((item, idx) => (
                                    <li className="flex w-full items-center gap-3 text-text text-opacity-80" key={idx}>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-primary to-secondary-30">
                                            <Check className="stroke-text" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href={'/#contact'} className="w-full">
                            <button
                                className="w-full rounded-md bg-gradient-to-r from-secondary to-secondary-30 py-1 font-semibold tracking-wide transition-opacity duration-300 hover:opacity-60"
                                type="button"
                            >
                                Avail
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="relative mt-8 flex w-full flex-col items-center gap-4 p-4 md:hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={service[cur].title + ' ' + cur}
                        className="flex h-[30rem] w-full flex-col items-center justify-between rounded-lg border-4 border-primary bg-gradient-to-b from-background to-primary-30 p-6 shadow-[0_0_80px_-5px] shadow-primary-30 md:w-[20rem]"
                        layout
                        initial={{
                            opacity: 0,
                            x: direction > 0 ? 1000 : -1000,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction < 0 ? 1000 : -1000 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeThreshold) {
                                paginate(1)
                            } else if (swipe > swipeThreshold) {
                                paginate(-1)
                            }
                        }}
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.1 },
                        }}
                    >
                        <div className="flex w-full flex-col items-center gap-8">
                            <h3 className="text-xl">{service[cur].title}</h3>
                            <ul className="flex w-full flex-col gap-3">
                                {service[cur].items.map((item, idx) => (
                                    <li className="flex w-full items-center gap-3 text-text text-opacity-80" key={idx}>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-primary to-secondary-30">
                                            <Check className="stroke-text" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href={service[cur].button} className="w-full">
                            <button
                                className="w-full rounded-md bg-gradient-to-r from-secondary to-secondary-30 py-1 font-semibold tracking-wide transition-opacity duration-300 hover:opacity-60"
                                type="button"
                            >
                                Avail
                            </button>
                        </Link>
                    </motion.div>
                </AnimatePresence>
                <div className="flex gap-3">
                    {service.map((x, idx) => (
                        <div
                            className={
                                'h-4 w-4 cursor-pointer rounded-full transition-colors duration-300 hover:bg-secondary' +
                                (idx === cur ? ' bg-primary' : ' bg-secondary-30')
                            }
                            onClick={() => paginate(idx - cur)}
                            key={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export function ContactSection() {
    const [status, setStatus] = useState('Submit')
    const [but, setBut] = useState(false)
    async function handleSumbit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('Submitting...')
        setBut(true)
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const phone = formData.get('phone') as string
        if (phone.length < 10 || /[a-zA-Z]/.test(phone)) {
            setStatus('Please enter a valid phone number')
            setBut(false)
            return
        }
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            content: formData.get('content') as string,
        }
        setStatus(await SendMail(data))
        setBut(false)
        form.reset()
    }
    return (
        <section id="contact" className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]">
            <h1 className="text-2xl text-primary md:text-4xl">Contact Us</h1>
            <form onSubmit={handleSumbit} className="grid w-full grid-cols-2 gap-4 md:max-w-2xl">
                <div className="col-span-2 w-full">
                    <label htmlFor="name" className="text-secondary md:text-lg">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="w-full rounded-md border-2 border-primary-30 bg-background px-4 py-1 text-text md:text-lg"
                        required
                    />
                </div>
                <div className="col-span-2 w-full md:col-span-1">
                    <label htmlFor="phone" className="text-secondary md:text-lg">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="w-full rounded-md border-2 border-primary-30 bg-background px-4 py-1 text-text md:text-lg"
                    />
                </div>
                <div className="col-span-2 w-full md:col-span-1">
                    <label htmlFor="email" className="text-secondary md:text-lg">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full rounded-md border-2 border-primary-30 bg-background px-4 py-1 text-text md:text-lg"
                    />
                </div>
                <div className="col-span-2 w-full">
                    <label htmlFor="content" className="text-secondary md:text-lg">
                        Body
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        className="h-36 w-full resize-none rounded-md border-2 border-primary-30 bg-background px-4 py-1 text-text placeholder:text-text-30 md:text-lg"
                        placeholder="Any questions? Projects you want to create with us?"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="col-span-2 w-full rounded-md bg-gradient-to-r from-primary to-secondary-30 py-1 font-semibold transition-opacity duration-300 hover:opacity-60 md:col-span-1 md:col-start-2"
                    disabled={but}
                >
                    {status}
                </button>
            </form>
        </section>
    )
}
