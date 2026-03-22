import { Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import '../../styles/article.css'

// 自定义 img 渲染，添加懒加载
const markdownComponents = {
    img: ({ node, ...props }) => <img loading="lazy" {...props} />,
}

function ArticleDetail({ post, content }) {
    if (!post || !content) return null

    const isHtml = post.format === 'html'

    return (
        <div className="article-detail">
            <h1>{post.title}</h1>
            <div className="article-meta">
                <span className="meta-date">{post.date}</span>
                {post.categories?.length > 0 && (
                    <span className="meta-categories">
                        分类：{post.categories.map((cat, i) => (
                            <span key={cat}>
                                {i > 0 && ', '}
                                <Link to={`/archives/category/${encodeURIComponent(cat)}`}>{cat}</Link>
                            </span>
                        ))}
                    </span>
                )}
            </div>
            <div className="article-body">
                {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    )
}

export default ArticleDetail
