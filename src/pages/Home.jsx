import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSignals } from '@preact/signals-react/runtime'
import ArticleList from '../components/Article/ArticleList'
import Pagination from '../components/Common/Pagination'
import Loading from '../components/Common/Loading'
import { postList, currentPage, pageSize, topPosts, normalPosts, postLoading } from '../signals/postSignals'
import { loadPostList } from '../utils/dataLoader'

function Home() {
    useSignals()
    const { page } = useParams()
    const navigate = useNavigate()

    const pageNum = parseInt(page) || 1

    // 加载文章列表
    useEffect(() => {
        if (postList.value.length === 0) {
            postLoading.value = true
            loadPostList()
                .then(data => { postList.value = data })
                .catch(err => console.error('加载文章列表失败:', err))
                .finally(() => { postLoading.value = false })
        }
    }, [])

    useEffect(() => {
        currentPage.value = pageNum
        document.title = pageNum > 1 ? `第${pageNum}页 - 笨木头的博客` : '笨木头的博客'
    }, [pageNum])

    if (postLoading.value) {
        return <Loading />
    }

    // 分页计算
    const allNormalPosts = normalPosts.value
    const totalPages = Math.ceil(allNormalPosts.length / pageSize.value)
    const start = (pageNum - 1) * pageSize.value
    const pagedPosts = allNormalPosts.slice(start, start + pageSize.value)

    // 第一页显示置顶文章
    const displayPosts = pageNum === 1
        ? [...topPosts.value, ...pagedPosts]
        : pagedPosts

    const handlePageChange = (newPage) => {
        if (newPage === 1) {
            navigate('/')
        } else {
            navigate(`/page/${newPage}`)
        }
        window.scrollTo(0, 0)
    }

    return (
        <div>
            <ArticleList posts={displayPosts} />
            <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default Home
