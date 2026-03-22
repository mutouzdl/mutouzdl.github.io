import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import CategoryTree from '../Category/CategoryTree'
import '../../styles/sidebar.css'

function Sidebar({ onNavigate }) {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search?key=${encodeURIComponent(keyword.trim())}`)
            setKeyword('')
            onNavigate?.()
        }
    }

    const handleLinkClick = () => {
        onNavigate?.()
    }

    return (
        <div className="sidebar-inner">
            {/* 作者信息 */}
            <header className="author-info">
                <h2>笨木头的博客</h2>
                <p>游戏开发 | 技术分享</p>
            </header>

            {/* 导航链接 */}
            <nav aria-label="主导航">
                <ul className="sidebar-nav">
                    <li><Link to="/" onClick={handleLinkClick}>首页</Link></li>
                    <li><Link to="/message" onClick={handleLinkClick}>留言</Link></li>
                </ul>
            </nav>

            {/* 搜索框 */}
            <div className="sidebar-search" role="search">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="搜索文章..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        aria-label="搜索文章"
                    />
                </form>
            </div>

            {/* 分类目录 */}
            <nav className="sidebar-section" aria-label="分类目录">
                <h3>分类目录</h3>
                <CategoryTree onNavigate={onNavigate} />
            </nav>
        </div>
    )
}

export default Sidebar
