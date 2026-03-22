import { useEffect } from 'react'
import { Link } from 'react-router'
import { categories, categoryLoading } from '../../signals/categorySignals'
import { loadCategories } from '../../utils/dataLoader'
import { useSignals } from '@preact/signals-react/runtime'

function CategoryTree({ onNavigate }) {
    useSignals()

    useEffect(() => {
        if (categories.value.length === 0) {
            categoryLoading.value = true
            loadCategories()
                .then(data => { categories.value = data })
                .catch(err => console.error('加载分类失败:', err))
                .finally(() => { categoryLoading.value = false })
        }
    }, [])

    if (categoryLoading.value) {
        return <p>加载中...</p>
    }

    return (
        <ul className="category-tree">
            {categories.value.map(cat => (
                <CategoryNode key={cat.id} category={cat} onNavigate={onNavigate} />
            ))}
        </ul>
    )
}

function CategoryNode({ category, onNavigate }) {
    return (
        <li>
            <Link
                to={`/archives/category/${encodeURIComponent(category.name)}`}
                onClick={() => onNavigate?.()}
            >
                {category.name}
            </Link>
            <span className="category-count">({category.count})</span>
            {category.children && category.children.length > 0 && (
                <ul className="category-tree children">
                    {category.children.map(child => (
                        <CategoryNode key={child.id} category={child} onNavigate={onNavigate} />
                    ))}
                </ul>
            )}
        </li>
    )
}

export default CategoryTree
