import { Metadata } from 'next'

export default function consMeta({
    title = 'DEVGO Studio',
    description = 'A web development studio based in Cebu. Helping you build your dreams to reality.',
    image = '/thumbnail.webp',
    icons = '/logo.png',
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
            images: [
                {
                    url: image,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@adrianbonpin',
        },
        icons,
        metadataBase: new URL('https://www.devgo.space'),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}
