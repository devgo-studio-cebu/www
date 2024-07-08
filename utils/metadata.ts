import { Metadata } from 'next'

export default function consMeta({
    title = 'DEVGO Studio',
    description = 'A web development studio based in Cebu. Helping you build your dreams to reality.',
    image = '/banner.webp',
    icons = '/icon.webp',
    noIndex = false,
}: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            siteName: title,
            images: [{
                url: image
            }]
        },
        icons,
        metadataBase: new URL('https://www.sync2va.com'),
        ...(noIndex && {
            robots: {
                index: true,
                follow: true
            }
        })
    }
}
