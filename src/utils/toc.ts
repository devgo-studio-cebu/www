export interface TocItem {
    slug: string
    text: string
    depth: number
    children: TocItem[]
}

export function buildToc(headings: { depth: number; slug: string; text: string }[]): TocItem[] {
    const toc: TocItem[] = []
    const stack: TocItem[] = []

    for (const h of headings) {
        if (h.depth < 2 || h.depth > 3) continue

        const item: TocItem = {
            slug: h.slug,
            text: h.text,
            depth: h.depth,
            children: [],
        }

        if (h.depth === 2) {
            toc.push(item)
            stack.length = 0
            stack.push(item)
        } else if (h.depth === 3 && stack.length > 0) {
            stack[0].children.push(item)
        }
    }

    return toc
}
