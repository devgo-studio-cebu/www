'use server'
import { table } from 'console'
import { Resend } from 'resend'

const mail = new Resend(process.env.RESEND_API_KEY)

export type contactData = {
    name: string
    phone: string
    email: string
    content: string
}

export async function SendMail(content: contactData) {
    try {
        const { data, error } = await mail.emails.send({
            from: 'devgo <contact@devgo.studio>',
            to: ['adrianbonpin@devgo.studio', 'jstanlee@devgo.studio'],
            subject: 'DEVGO | Contact',
            react: EmailTemplate({
                name: content.name,
                phone: content.phone,
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

function EmailTemplate({ name, phone, email, content }: contactData) {
    return (
        <div>
            <p>
                <strong>Name:</strong> {name}
            </p>
            <p>
                <strong>Contact Number:</strong> {phone}
            </p>
            <p>
                <strong>Email:</strong> {email}
            </p>
            <p>
                <strong>Content:</strong> {content}
            </p>
        </div>
    )
}
