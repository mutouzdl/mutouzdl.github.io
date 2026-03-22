import { Link } from 'react-router'

/**
 * 上一篇/下一篇导航
 */
function ArticleNav({ prevPost, nextPost }) {
    return (
        <div className="article-nav">
            <div>
                {prevPost && (
                    <Link to={`/archives/${prevPost.id}`}>
                        ← {prevPost.title}
                    </Link>
                )}
            </div>
            <div>
                {nextPost && (
                    <Link to={`/archives/${nextPost.id}`}>
                        {nextPost.title} →
                    </Link>
                )}
            </div>
        </div>
    )
}

export default ArticleNav
