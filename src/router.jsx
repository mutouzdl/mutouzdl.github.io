import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import App from './App'
import Loading from './components/Common/Loading'

const Home = lazy(() => import('./pages/Home'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const MessagePage = lazy(() => import('./pages/MessagePage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function SuspenseWrapper({ children }) {
    return <Suspense fallback={<Loading />}>{children}</Suspense>
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
            { path: 'page/:page', element: <SuspenseWrapper><Home /></SuspenseWrapper> },
            { path: 'archives/:id', element: <SuspenseWrapper><ArticlePage /></SuspenseWrapper> },
            { path: 'archives/category/:name', element: <SuspenseWrapper><CategoryPage /></SuspenseWrapper> },
            { path: 'search', element: <SuspenseWrapper><SearchPage /></SuspenseWrapper> },
            { path: 'message', element: <SuspenseWrapper><MessagePage /></SuspenseWrapper> },
            { path: '*', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
        ],
    },
])

export default router
