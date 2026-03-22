import { Link } from 'react-router'

function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1 style={{ fontSize: '72px', color: '#999', marginBottom: '10px' }}>404</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                页面不存在或已被删除
            </p>
            <Link to="/" style={{ fontSize: '16px' }}>← 返回首页</Link>
        </div>
    )
}

export default NotFound
