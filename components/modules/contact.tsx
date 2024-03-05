'use client'

import { FormEvent, useState } from 'react'
import styles from './contact.module.css'
import { SendMail } from '@/utils/serverActions'

export default function Contact() {
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        content: '',
    })

    const [formErr, setFormErr] = useState({
        name: false,
        email: false,
        content: false,
    })

    const [bot, setBot] = useState('')

    const [status, setStatus] = useState('Submit')

    async function submitMail(e: FormEvent) {
        e.preventDefault()

        if ( bot != '' ){
            return
        }

        setStatus('Submitting...')

        if (contactData.name === '') {
            setFormErr({
                ...formErr,
                name: true,
            })
            setStatus('Submit')
            return
        }
        if (contactData.email === '') {
            setFormErr({
                ...formErr,
                email: true,
            })
            setStatus('Submit')
            return
        }
        if (contactData.content.length < 10) {
            setFormErr({
                ...formErr,
                content: true,
            })
            setContactData({
                ...contactData,
                content: '',
            })
            setStatus('Submit')
            return
        }

        const res = await SendMail(contactData)
        setStatus(res)
        if (res != 'Submitted!') {
        } else {
            setContactData({ name: '', email: '', content: '' })
        }
    }

    return (
        <form onSubmit={submitMail} className={styles.contact}>
            <input
                type="text"
                placeholder="Enter Name"
                aria-label="Name"
                value={contactData.name}
                onChange={(e) => {
                    setContactData({
                        ...contactData,
                        name: e.target.value,
                    })
                    setFormErr({
                        ...formErr,
                        name: false,
                    })
                }}
                className={formErr.name ? styles.error : undefined}
            />
            <input
                type="email"
                placeholder="Enter Email"
                aria-label="eMail"
                value={contactData.email}
                onChange={(e) => {
                    setContactData({
                        ...contactData,
                        email: e.target.value,
                    })
                    setFormErr({
                        ...formErr,
                        email: false,
                    })
                }}
                className={formErr.email ? styles.error : undefined}
            />
            <textarea
                placeholder="Minimum 10 characters..."
                aria-label="Content"
                rows={5}
                value={contactData.content}
                onChange={(e) => {
                    setContactData({
                        ...contactData,
                        content: e.target.value,
                    })
                    setFormErr({
                        ...formErr,
                        content: false,
                    })
                }}
                className={formErr.content ? styles.error : undefined}
            />
            <input type="hidden" name="honeypot" value={bot} onChange={(e)=>setBot(e.target.value)} />
            <button type="submit">{status}</button>
        </form>
    )
}
