import { signal, computed } from '@preact/signals-react'

// 文章列表数据
export const postList = signal([])

// 当前页码
export const currentPage = signal(1)

// 每页文章数
export const pageSize = signal(10)

// 当前文章详情
export const currentPost = signal(null)

// 文章加载状态
export const postLoading = signal(false)

// 置顶文章
export const topPosts = computed(() =>
    postList.value.filter(p => p.isTop)
)

// 非置顶文章
export const normalPosts = computed(() =>
    postList.value.filter(p => !p.isTop)
)

// 文章总数
export const totalPosts = computed(() => postList.value.length)
