import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from './components/Layout/Sidebar'
import './styles/layout.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  // 路由变化时关闭侧边栏
  useEffect(() => {
    closeSidebar()
  }, [location.pathname])

  return (
    <div className="blog-container">
      {/* 移动端汉堡按钮 */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="菜单"
      >
        ☰
      </button>

      {/* 遮罩层 */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`blog-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onNavigate={closeSidebar} />
      </aside>
      <main className="blog-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
