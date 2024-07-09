'use client'
import Image, { StaticImageData } from 'next/image'

import logo from '@/public/logo.svg'
import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, Twitter, XIcon } from 'lucide-react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SendMail } from '@/utils/serverActions'
import useMeasure from 'react-use-measure'

export function HeroSection({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <section className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]">
                <div className="absolute left-0 top-0 h-[10rem] w-full overflow-hidden bg-gradient-to-b from-primary-30 to-transparent">
                    <img src="grid.svg" alt="DEVGO Logo" className="grid-clip w-full opacity-10" />
                </div>
                <div className="z-10 flex w-full flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16">
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

export function PortfolioSection({
    projects,
}: {
    projects: {
        name: string
        logo?: StaticImageData
        date: string
        desc: string
        preview?: StaticImageData
        link: string
    }[]
}) {
    const scrollRef = useRef(null)
    const startRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ['start 80%', '100% end'],
    })
    const { scrollYProgress: startProg } = useScroll({
        target: scrollRef,
        offset: ['start end', '15% end'],
    })
    const scrolPos = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    function checkSide(project: any, idx: number) {
        if (idx % 2 === 0) {
            return <DesktopProjectLeft key={project.name + ' left ' + idx} project={project} />
        }
        return <DesktopProjectRight key={project.name + ' right ' + idx} project={project} />
    }
    return (
        <section
            id="portfolio"
            className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]"
        >
            <h1 className="text-2xl text-primary md:text-4xl">Portfolio</h1>
            {/* For Mobile */}
            <div className="mt-8 flex w-full flex-col items-center gap-20 md:hidden">
                {projects.map((project, idx) => (
                    <MobileProjectCard key={project.name + ' mobile ' + idx} project={project} />
                ))}
            </div>
            {/* For Desktop */}
            <div className="relative mt-8 hidden w-full flex-col items-center gap-20 pt-8 md:flex" ref={scrollRef}>
                <motion.div
                    style={{ scale: startProg }}
                    className="absolute -top-2 h-4 w-4 rounded-full bg-primary"
                    ref={startRef}
                />
                <motion.div
                    style={{ height: scrolPos }}
                    className="absolute top-0 w-1 bg-gradient-to-b from-primary from-90% to-transparent to-[100%]"
                />
                {projects.map((project, idx) => checkSide(project, idx))}
            </div>
        </section>
    )
}

function MobileProjectCard({ project }: { project: any }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative flex w-full flex-col items-center justify-center gap-2 *:z-10"
        >
            <img src="grid.svg" alt="grid" className="portfolio-grid absolute z-0 scale-110" />
            {project.logo && <Image src={project.logo} alt={project.name} className="w-1/3" />}
            <p className="bg-gradient-to-br from-red-200 to-text bg-clip-text text-center font-semibold text-transparent">
                {project.desc}
            </p>
            <p className="bg-gradient-to-br from-red-200 to-text bg-clip-text font-bold text-transparent">
                {project.date}
            </p>
            {project.preview && (
                <Link href={project.link || '/'}>
                    <Image
                        src={project.preview}
                        alt={project.name}
                        className="cursor-pointer rounded-md shadow-[0_0_37px_0px] shadow-primary-30 transition-all duration-300 hover:scale-105"
                    />
                </Link>
            )}
        </motion.div>
    )
}

function DesktopProjectLeft({ project }: { project: any }) {
    const lineRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ['start center', 'end 65%'],
    })
    const scrolPos = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
    const opStat = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    return (
        <motion.div ref={lineRef} transition={{ duration: 0.5, delay: 0.5 }} className="relative grid grid-cols-2">
            <div className="relative col-span-1 flex items-center justify-between">
                <motion.div
                    style={{ width: scrolPos }}
                    className="absolute right-0 h-1 bg-gradient-to-l from-primary from-60% to-transparent to-[100%]"
                />
                <motion.div style={{ opacity: opStat }} className="w-1/2">
                    {project.logo && <Image src={project.logo} alt={project.name} className="w-4/5" />}
                </motion.div>
                <motion.div style={{ opacity: opStat }} className="grid w-1/2 grid-rows-2 gap-4">
                    <p className="flex flex-col justify-end bg-gradient-to-br from-red-200 to-text bg-clip-text pr-4 text-right font-bold text-transparent">
                        {project.date}
                    </p>
                    <p className="flex flex-col justify-start bg-gradient-to-br from-red-200 to-text bg-clip-text pr-4 text-right font-semibold text-transparent">
                        {project.desc}
                    </p>
                </motion.div>
            </div>
            <motion.div style={{ opacity: opStat }} className="relative col-span-1">
                {project.preview && (
                    <Link href={project.link || '/'} className="flex justify-end">
                        <Image
                            src={project.preview}
                            alt={project.name}
                            className="z-10 w-[80%] cursor-pointer rounded-md shadow-[0_0_37px_0px] shadow-primary-30 transition-all duration-300 hover:scale-105"
                        />
                    </Link>
                )}
                <img
                    src="grid.svg"
                    alt="grid"
                    className="desktop-preview-grid absolute top-[50%] translate-x-[10%] translate-y-[-50%]"
                />
            </motion.div>
        </motion.div>
    )
}

function DesktopProjectRight({ project }: { project: any }) {
    const lineRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ['start center', 'end 65%'],
    })
    const scrolPos = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
    const opStat = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    return (
        <motion.div ref={lineRef} transition={{ duration: 0.5, delay: 0.5 }} className="relative grid grid-cols-2">
            <motion.div style={{ opacity: opStat }} className="relative col-span-1">
                {project.preview && (
                    <Link href={project.link || '/'} className="flex justify-start">
                        <Image
                            src={project.preview}
                            alt={project.name}
                            className="z-10 w-[80%] cursor-pointer rounded-md shadow-[0_0_37px_0px] shadow-primary-30 transition-all duration-300 hover:scale-105"
                        />
                    </Link>
                )}
                <img
                    src="grid.svg"
                    alt="grid"
                    className="desktop-preview-grid absolute top-[50%] translate-x-[-10%] translate-y-[-50%]"
                />
            </motion.div>
            <div className="relative col-span-1 flex items-center justify-between">
                <motion.div
                    style={{ width: scrolPos }}
                    className="absolute left-0 h-1 bg-gradient-to-r from-primary from-60% to-transparent to-[100%]"
                />
                <motion.div style={{ opacity: opStat }} className="grid w-1/2 grid-rows-2 gap-4">
                    <p className="flex flex-col justify-end bg-gradient-to-br from-red-200 to-text bg-clip-text pl-4 text-left font-bold text-transparent">
                        {project.date}
                    </p>
                    <p className="flex flex-col justify-start bg-gradient-to-br from-red-200 to-text bg-clip-text pl-4 text-left font-semibold text-transparent">
                        {project.desc}
                    </p>
                </motion.div>
                <motion.div style={{ opacity: opStat }} className="flex w-1/2 justify-end">
                    {project.logo && <Image src={project.logo} alt={project.name} className="w-4/5" />}
                </motion.div>
            </div>
        </motion.div>
    )
}

export function ClientSection({ clients }: { clients: string[] }) {
    let [ref, { width }] = useMeasure()
    const xTrans = useMotionValue(0)
    useEffect(() => {
        let controls
        let finalPos = -width / 3 - clients.length
        controls = animate(xTrans, [0, finalPos], {
            ease: 'linear',
            duration: 25,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 0,
        })

        return controls.stop
    }, [width, xTrans])
    return (
        <section id="clients" className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]">
            <h1 className="text-2xl text-primary md:text-4xl">And many more...</h1>
            <div className="relative mt-8 h-[10rem] w-lvw py-4">
                <motion.div style={{ x: xTrans }} className="absolute left-0 z-10 flex h-full w-max gap-8" ref={ref}>
                    {[...clients, ...clients, ...clients].map((image, idx) => (
                        <div key={idx} className="max-h-full w-[12rem]">
                            <img
                                src={`/logos/${image}.webp`}
                                alt={`img ${idx}`}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
                <img
                    src="grid.svg"
                    alt="grid"
                    className="clients-grid absolute left-[50%] top-[50%] w-lvw translate-x-[-50%] translate-y-[-50%] opacity-40"
                />
            </div>
        </section>
    )
}

export function TeamSection({
    members,
}: {
    members: {
        image: StaticImageData
        name: string
        role: string
        socials?: {
            fb?: string
            x?: string
            li?: string
            in?: string
        }
        skills?: string[]
    }[]
}) {
    const [card, setCard] = useState(members)
    const handleNext = (idx: number) => {
        if (idx === 0) {
            const temp = [...card]
            temp.unshift(temp.pop() as any)
            setCard(temp)
        } else if (idx === 1) {
            const temp = [...card]
            setCard([...temp.slice(1), ...temp.slice(0, 1)])
        }
    }
    const handlePos = (idx: number) => {
        if (idx === 2) {
            return 1
        }
        return 0.4
    }
    const handleScale = (idx: number) => {
        if (idx === 2) {
            return 1
        }
        return 0.9
    }
    const handleExit = (idx: number) => {
        if (idx === 0) return '-50%'
        if (idx === 2) return '50%'
    }
    const handleEnter = (idx: number) => {
        if (idx === 0) return '-25%'
        if (idx === 2) return '25%'
        return 0
    }
    return (
        <section id="team" className="relative flex min-h-[fit] flex-col items-center px-4 py-[10svh] md:px-[10svw]">
            <div className="flex max-w-2xl flex-col items-center gap-4">
                <h1 className="text-2xl text-primary md:text-4xl">The Team</h1>
                <p className="text-justify text-text-30">
                    Swipe through our carefully handpicked members that are full of talent, vigor, and most importantly,
                    a team player.
                </p>
            </div>
            <div className="team-mask relative flex h-[30rem] w-max flex-nowrap items-center justify-center gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {card.slice(0, 5).map((member, idx) => (
                        <motion.div
                            layout
                            className={
                                'relative flex h-[24rem] w-[15rem] select-none flex-col items-center rounded-lg border-2 shadow-primary-30 transition-[box-shadow,color,background-color,border-color,fill,stroke] duration-300' +
                                (idx === 2 ? ' z-10 border-primary shadow-[0_0_40px_0px]' : ' z-0 border-transparent')
                            }
                            key={member.name}
                            initial={{ opacity: 0, x: handleEnter(idx) }}
                            animate={{ opacity: handlePos(idx), x: 0, scale: handleScale(idx) }}
                            exit={{ opacity: 0, x: handleExit(idx) }}
                        >
                            <Image
                                src={member.image}
                                alt={member.name}
                                className="h-full select-none rounded-lg object-cover"
                            />
                            <div className="absolute bottom-0 flex h-[50%] w-full items-end justify-center gap-6 rounded-b-lg bg-gradient-to-t from-black from-20% to-transparent pb-4">
                                {member.socials?.fb && (
                                    <Link href={member.socials?.fb as string}>
                                        <Facebook className="h-4 w-4 transition-colors hover:stroke-secondary" />
                                    </Link>
                                )}
                                {member.socials?.x && (
                                    <Link href={member.socials?.x as string}>
                                        <Twitter className="h-4 w-4 transition-colors hover:stroke-secondary" />
                                    </Link>
                                )}
                                {member.socials?.li && (
                                    <Link href={member.socials?.li as string}>
                                        <Linkedin className="h-4 w-4 transition-colors hover:stroke-secondary" />
                                    </Link>
                                )}
                                {member.socials?.in && (
                                    <Link href={member.socials?.in as string}>
                                        <Instagram className="h-4 w-4 transition-colors hover:stroke-secondary" />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div
                    className="group absolute left-[35%] top-[50%] z-10 flex h-8 w-8 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-gradient-to-l from-secondary-30 to-secondary transition-colors duration-300 hover:bg-primary"
                    onClick={() => handleNext(0)}
                >
                    <ChevronLeft className="stroke-primary transition-colors duration-300 group-hover:stroke-text" />
                </div>
                <div
                    className="absolute right-[35%] top-[50%] z-10 flex h-8 w-8 translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-secondary-30 to-secondary transition-colors duration-300 hover:bg-primary"
                    onClick={() => handleNext(1)}
                >
                    <ChevronRight className="stroke-primary transition-colors duration-300 group-hover:stroke-text" />
                </div>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent from-10% via-primary to-transparent to-90%" />
            <div className="mt-8 flex flex-col items-center">
                <h2 className="text-2xl text-primary">{card[2].name}</h2>
                <p className="text-center text-base text-text-30">{card[2].role}</p>
            </div>
            {card[2].skills && (
                <div className="mt-8">
                    <p className="text-center text-base text-text-30">Skills</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-6">
                        {card[2].skills.map((skill, idx) => (
                            <img
                                key={idx}
                                src={`/skills/${skill}.webp`}
                                alt={skill}
                                className="h-8 w-8 md:h-12 md:w-12"
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}
