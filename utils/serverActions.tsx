'use server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'
import { Resend } from 'resend'

const mail = new Resend(process.env.RESEND_API_KEY)

const redis = Redis.fromEnv()

const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, '10 s'),
})

export type contactData = {
    name: string
    phone: string
    email: string
    content: string
}

export async function SendMail(content: contactData) {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1'
    const { success, reset } = await rateLimit.limit(ip)

    if (!success) {
        const now = Date.now()
        const retryAfter = Math.floor((reset - now) / 1000)
        return 'Too many Requests! Retry after ' + retryAfter + 's'
    }

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
