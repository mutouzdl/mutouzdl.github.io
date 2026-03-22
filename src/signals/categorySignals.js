import { signal } from '@preact/signals-react'

// 分类树数据
export const categories = signal([])

// 分类加载状态
export const categoryLoading = signal(false)
