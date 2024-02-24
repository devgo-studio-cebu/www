'use server'

import { EmailTemplate } from '@/components/email/template'
import { Resend } from 'resend'

const mail = new Resend(process.env.RESEND_API_KEY)

export type contactData = {
    name: string
    email: string
    content: string
}

export async function SendMail(content: contactData) {
    try {
        const { data, error } = await mail.emails.send({
            from: 'devgo <contact@devgo.space>',
            to: 'adrianbonpin@devgo.space',
            subject: 'DEVGO | Contact',
            react: EmailTemplate({
                name: content.name,
                email: content.email,
                content: content.content,
            }) as React.ReactElement,
        })

        if (error) {
            return 'API Error'
        }

        return 'Submitted!'
    } catch (error) {
        return 'Server Error'
    }
}
