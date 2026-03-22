import { Link } from 'react-router'
import '../../styles/article.css'

function ArticleList({ posts }) {
    if (!posts || posts.length === 0) {
        return <p className="empty-hint">暂无文章</p>
    }

    return (
        <div className="article-list">
            {posts.map(post => (
                <div className="article-item" key={post.id}>
                    <h2>
                        {post.isTop && <span className="top-tag">置顶</span>}
                        <Link to={`/archives/${post.id}`}>{post.title}</Link>
                    </h2>
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
                        <span className="meta-comments">评论：{post.commentCount || 0}</span>
                    </div>
                    {post.excerpt && <div className="article-excerpt">{post.excerpt}</div>}
                </div>
            ))}
        </div>
    )
}

export default ArticleList
