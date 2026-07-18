import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((data) => {
        if (cancelled) return
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      ({ brand, model }) =>
        brand.toLowerCase().includes(term) || model.toLowerCase().includes(term),
    )
  }, [products, query])

  return (
    <div className="page product-list">
      <div className="product-list__top">
        <div>
          <h1 className="product-list__title">Smartphones</h1>
          <p className="product-list__subtitle">
            Explora nuestra selección curada de dispositivos móviles de última
            generación, diseñados para la excelencia técnica.
          </p>
        </div>
        <div className="product-list__search">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {status === 'loading' && <p className="product-list__status">Cargando productos...</p>}
      {status === 'error' && (
        <p className="product-list__status">No se pudieron cargar los productos.</p>
      )}
      {status === 'ready' && filtered.length === 0 && (
        <p className="product-list__status">Sin resultados para «{query}».</p>
      )}

      <div className="product-list__grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
