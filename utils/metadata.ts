import { Metadata } from "next"

export default function consMeta({
    title = 'DEVGO',
    description = 'Web Development and Design Studio',
    image = '/thumbnail.png',
    icons = '/logo.svg',
    noIndex = false
} : {
    title? : string
    description? : string
    image? : string
    icons? : string
    noIndex? : boolean
} = {}) : Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{
                url: image
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@adrianbonpin'
        },
        icons,
        metadataBase: new URL('https://www.devgo.space'),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false
            }
        })
    }
}