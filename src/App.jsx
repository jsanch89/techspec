import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import CartPanel from './components/CartPanel.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <CartPanel />
    </>
  )
}

export default App
