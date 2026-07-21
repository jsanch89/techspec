import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default App
