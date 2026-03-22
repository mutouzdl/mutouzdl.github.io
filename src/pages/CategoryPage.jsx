import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSignals } from '@preact/signals-react/runtime'
import ArticleList from '../components/Article/ArticleList'
import Pagination from '../components/Common/Pagination'
import Loading from '../components/Common/Loading'
import { postList, pageSize, postLoading } from '../signals/postSignals'
import { loadPostList } from '../utils/dataLoader'

function CategoryPage() {
    useSignals()
    const { name } = useParams()
    const navigate = useNavigate()
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (postList.value.length === 0) {
            postLoading.value = true
            loadPostList()
                .then(data => { postList.value = data })
                .catch(err => console.error('加载文章列表失败:', err))
                .finally(() => { postLoading.value = false })
        }
    }, [])

    // 分类名变化时重置页码
    useEffect(() => {
        setPage(1)
        document.title = `分类：${decodeURIComponent(name)} - 笨木头的博客`
    }, [name])

    if (postLoading.value) {
        return <Loading />
    }

    const categoryName = decodeURIComponent(name)
    const filtered = postList.value.filter(p => p.categories?.includes(categoryName))
    const totalPages = Math.ceil(filtered.length / pageSize.value)
    const start = (page - 1) * pageSize.value
    const pagedPosts = filtered.slice(start, start + pageSize.value)

    const handlePageChange = (newPage) => {
        setPage(newPage)
        window.scrollTo(0, 0)
    }

    return (
        <div>
            <h2 className="page-title">分类：{categoryName}（共 {filtered.length} 篇）</h2>
            <ArticleList posts={pagedPosts} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default CategoryPage
