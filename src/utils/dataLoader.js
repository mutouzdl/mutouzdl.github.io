const DATA_BASE = '/data'

let postListCache = null
let categoriesCache = null
let searchIndexCache = null

/**
 * 加载文章列表
 */
export async function loadPostList() {
    if (postListCache) return postListCache
    const res = await fetch(`${DATA_BASE}/posts-list.json`)
    if (!res.ok) throw new Error('Failed to load posts list')
    postListCache = await res.json()
    return postListCache
}

/**
 * 加载单篇文章内容
 * @param {string|number} id - 文章 ID
 * @param {string} format - 文章格式 'md' | 'html'
 */
export async function loadPost(id, format = 'md') {
    const ext = format === 'html' ? 'html' : 'md'
    const res = await fetch(`${DATA_BASE}/posts/${id}.${ext}`)
    if (!res.ok) throw new Error(`Failed to load post ${id}`)
    return res.text()
}

/**
 * 加载分类树
 */
export async function loadCategories() {
    if (categoriesCache) return categoriesCache
    const res = await fetch(`${DATA_BASE}/categories.json`)
    if (!res.ok) throw new Error('Failed to load categories')
    categoriesCache = await res.json()
    return categoriesCache
}

/**
 * 加载搜索索引
 */
export async function loadSearchIndex() {
    if (searchIndexCache) return searchIndexCache
    const res = await fetch(`${DATA_BASE}/search-index.json`)
    if (!res.ok) throw new Error('Failed to load search index')
    searchIndexCache = await res.json()
    return searchIndexCache
}
