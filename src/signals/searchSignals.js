import { signal } from '@preact/signals-react'

// 搜索关键词
export const searchKeyword = signal('')

// 搜索结果
export const searchResults = signal([])

// 搜索加载状态
export const searchLoading = signal(false)
