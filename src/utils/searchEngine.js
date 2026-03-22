let indexData = null

/**
 * 初始化搜索引擎
 * @param {Array} data - 搜索索引 [{id, title, content, categories, date}]
 */
export function initSearch(data) {
    indexData = data
}

/**
 * 执行搜索
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的结果 [{id, title, excerpt, matchType}]
 */
export function search(keyword) {
    if (!indexData || !keyword.trim()) return []

    const kw = keyword.toLowerCase().trim()
    const results = []

    for (const item of indexData) {
        const title = (item.title || '').toLowerCase()
        const content = (item.content || '').toLowerCase()
        const titleMatch = title.includes(kw)
        const contentMatch = content.includes(kw)

        if (titleMatch || contentMatch) {
            // 生成包含关键词的摘要片段
            let excerpt = ''
            if (contentMatch) {
                const idx = content.indexOf(kw)
                const start = Math.max(0, idx - 40)
                const end = Math.min(content.length, idx + kw.length + 80)
                excerpt = (start > 0 ? '...' : '') +
                    item.content.substring(start, end) +
                    (end < content.length ? '...' : '')
            }

            results.push({
                id: item.id,
                title: item.title,
                date: item.date,
                categories: item.categories || [],
                excerpt,
                titleMatch,
            })
        }
    }

    // 标题匹配排前面
    results.sort((a, b) => (b.titleMatch ? 1 : 0) - (a.titleMatch ? 1 : 0))
    return results
}
