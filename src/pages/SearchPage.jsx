import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { useSignals } from '@preact/signals-react/runtime'
import Loading from '../components/Common/Loading'
import { searchResults, searchLoading } from '../signals/searchSignals'
import { loadSearchIndex } from '../utils/dataLoader'
import { initSearch, search } from '../utils/searchEngine'

function SearchPage() {
    useSignals()
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('key') || ''

    useEffect(() => {
        document.title = keyword ? `搜索：${keyword} - 笨木头的博客` : '搜索 - 笨木头的博客'
    }, [keyword])

    useEffect(() => {
        if (!keyword.trim()) {
            searchResults.value = []
            return
        }
        searchLoading.value = true
        loadSearchIndex()
            .then(data => {
                initSearch(data)
                searchResults.value = search(keyword)
            })
            .catch(err => console.error('搜索失败:', err))
            .finally(() => { searchLoading.value = false })
    }, [keyword])

    if (searchLoading.value) {
        return <Loading />
    }

    return (
        <div>
            <h2 className="page-title">搜索：{keyword}</h2>
            <p className="search-count">找到 {searchResults.value.length} 篇相关文章</p>
            <div className="search-results">
                {searchResults.value.map(result => (
                    <div className="search-result-item" key={result.id}>
                        <h3>
                            <Link to={`/archives/${result.id}`}>{result.title}</Link>
                        </h3>
                        <div className="article-meta">
                            <span className="meta-date">{result.date}</span>
                            {result.categories?.length > 0 && (
                                <span className="meta-categories">
                                    分类：{result.categories.join(', ')}
                                </span>
                            )}
                        </div>
                        {result.excerpt && (
                            <p className="search-excerpt">{result.excerpt}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchPage
