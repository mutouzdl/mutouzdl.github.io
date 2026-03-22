import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useSignals } from '@preact/signals-react/runtime'
import ArticleDetail from '../components/Article/ArticleDetail'
import ArticleNav from '../components/Article/ArticleNav'
import GiscusComment from '../components/Comment/GiscusComment'
import Loading from '../components/Common/Loading'
import { postList, postLoading } from '../signals/postSignals'
import { loadPostList, loadPost } from '../utils/dataLoader'

function ArticlePage() {
    useSignals()
    const { id } = useParams()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    // 确保文章列表已加载
    useEffect(() => {
        if (postList.value.length === 0) {
            postLoading.value = true
            loadPostList()
                .then(data => { postList.value = data })
                .catch(err => console.error('加载文章列表失败:', err))
                .finally(() => { postLoading.value = false })
        }
    }, [])

    // 加载文章内容
    useEffect(() => {
        setLoading(true)
        const post = postList.value.find(p => String(p.id) === String(id))
        const format = post?.format || 'md'

        loadPost(id, format)
            .then(text => setContent(text))
            .catch(err => console.error('加载文章失败:', err))
            .finally(() => setLoading(false))
    }, [id, postList.value])

    if (loading || postLoading.value) {
        return <Loading />
    }

    // 查找当前文章及上下篇
    const currentIndex = postList.value.findIndex(p => String(p.id) === String(id))
    const post = postList.value[currentIndex]
    const prevPost = currentIndex > 0 ? postList.value[currentIndex - 1] : null
    const nextPost = currentIndex < postList.value.length - 1 ? postList.value[currentIndex + 1] : null

    if (!post) {
        return <div className="empty-hint">文章不存在</div>
    }

    // 更新页面标题
    document.title = `${post.title} - 笨木头的博客`

    return (
        <article>
            <ArticleDetail post={post} content={content} />
            <ArticleNav prevPost={prevPost} nextPost={nextPost} />
            <GiscusComment />
        </article>
    )
}

export default ArticlePage
