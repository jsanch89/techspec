import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import useDebounce from '../hooks/useDebounce.js'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const load = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    getProducts()
      .then((data) => {
        if (cancelled) return
        setProducts(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('No se pudieron cargar los productos:', err)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => load(), [load])

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      ({ brand, model }) =>
        brand.toLowerCase().includes(term) || model.toLowerCase().includes(term),
    )
  }, [products, debouncedQuery])

  return (
    <div className="page product-list">
      <div className="product-list__top">
        <div>
          <h1 className="product-list__title">Smartphones</h1>
          <p className="product-list__subtitle">
            Explora nuestra selección curada de dispositivos móviles de última generación,
            diseñados para la excelencia técnica.
          </p>
        </div>
        <div className="product-list__search">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {status === 'loading' && (
        <p className="product-list__status">Cargando productos...</p>
      )}
      {status === 'error' && (
        <div className="product-list__status">
          <p>No se pudieron cargar los productos.</p>
          <button type="button" className="product-list__retry" onClick={() => load()}>
            Reintentar
          </button>
        </div>
      )}
      {status === 'ready' && filtered.length === 0 && (
        <p className="product-list__status">Sin resultados para «{debouncedQuery}».</p>
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
