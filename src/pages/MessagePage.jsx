import { useEffect } from 'react'
import GiscusComment from '../components/Comment/GiscusComment'

function MessagePage() {
    useEffect(() => {
        document.title = '留言板 - 笨木头的博客'
    }, [])

    return (
        <div>
            <h2 className="page-title">留言板</h2>
            <p>欢迎留言交流~</p>
            <GiscusComment />
        </div>
    )
}

export default MessagePage
