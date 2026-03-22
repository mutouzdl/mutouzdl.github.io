function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    // 生成页码列表，带省略号
    const getPages = () => {
        const pages = []
        const delta = 2 // 当前页两侧各显示几个

        // 始终显示第一页
        pages.push(1)

        const rangeStart = Math.max(2, currentPage - delta)
        const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

        if (rangeStart > 2) pages.push('...')
        for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
        if (rangeEnd < totalPages - 1) pages.push('...')

        // 始终显示最后一页
        if (totalPages > 1) pages.push(totalPages)

        return pages
    }

    return (
        <nav className="pagination" aria-label="分页导航">
            <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="上一页"
            >
                上一页
            </button>
            {getPages().map((page, idx) =>
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="下一页"
            >
                下一页
            </button>
        </nav>
    )
}

export default Pagination
