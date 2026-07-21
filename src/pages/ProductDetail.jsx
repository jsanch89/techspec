import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, addToCart } from '../api/client'
import { useCart } from '../context/CartContext.jsx'
import './ProductDetail.css'

const COLOR_HEX = {
  black: '#131b2e',
  white: '#f4f4f4',
  grey: '#8a8d91',
  gray: '#8a8d91',
  blue: '#2c5f9b',
  red: '#b03a3a',
  pink: '#e7a6b7',
  purple: '#7b5ea7',
  gold: '#d9b878',
  silver: '#d5d8dc',
  green: '#4a7c59',
  yellow: '#e5c85a',
  brown: '#7a5c43',
  orange: '#d97b3f',
}

function colorToHex(name = '') {
  const key = name.trim().toLowerCase()
  return COLOR_HEX[key] || '#c6c6cd'
}

function formatValue(value) {
  if (Array.isArray(value)) return value.join(', ')
  return value || '—'
}

function ProductDetail() {
  const { id } = useParams()
  const { updateCount } = useCart()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [colorCode, setColorCode] = useState(null)
  const [storageCode, setStorageCode] = useState(null)
  const [addStatus, setAddStatus] = useState('idle')

  const load = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    getProduct(id)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        // Primera opción seleccionada por defecto
        setColorCode(data.options?.colors?.[0]?.code ?? null)
        setStorageCode(data.options?.storages?.[0]?.code ?? null)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('No se pudo cargar el producto:', err)
        setStatus(err?.notFound ? 'notfound' : 'error')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => load(), [load])

  // Al cambiar la selección, el feedback previo de "añadido"/"error" deja de ser válido.
  useEffect(() => {
    setAddStatus('idle')
  }, [colorCode, storageCode])

  const handleAdd = async () => {
    if (colorCode == null || storageCode == null) return
    setAddStatus('adding')
    try {
      const { count } = await addToCart({ id, colorCode, storageCode })
      updateCount(count)
      setAddStatus('added')
    } catch {
      setAddStatus('error')
    }
  }

  if (status === 'loading') {
    return <div className="page detail__status">Cargando producto...</div>
  }
  if (status === 'notfound') {
    return (
      <div className="page detail__status">
        <p>Producto no encontrado.</p>
        <Link to="/" className="detail__back">
          Volver al listado
        </Link>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="page detail__status">
        <p>No se pudo cargar el producto.</p>
        <button type="button" className="detail__retry" onClick={() => load()}>
          Reintentar
        </button>
      </div>
    )
  }

  const colors = product.options?.colors ?? []
  const storages = product.options?.storages ?? []
  const selectedColor = colors.find((color) => color.code === colorCode)

  const specs = [
    { label: 'CPU', value: product.cpu },
    { label: 'RAM', value: product.ram },
    { label: 'Sistema operativo', value: product.os },
    { label: 'Resolución de pantalla', value: product.displayResolution },
    { label: 'Batería', value: product.battery },
    { label: 'Cámara principal', value: product.primaryCamera },
    { label: 'Cámara secundaria', value: product.secondaryCmera },
    { label: 'Dimensiones', value: product.dimentions },
    { label: 'Peso', value: product.weight ? `${product.weight} g` : '' },
  ]

  return (
    <div className="page detail">
      <div className="detail__image-panel">
        <img
          src={product.imgUrl}
          alt={`${product.brand} ${product.model}`}
          className="detail__image"
        />
      </div>

      <div className="detail__info">
        <span className="detail__badge">{product.brand}</span>
        <h1 className="detail__title">{product.model}</h1>
        <p className="detail__price">
          {product.price ? `${product.price} €` : 'Precio no disponible'}
        </p>

        <hr className="detail__divider" />

        <h3 className="detail__section-title">Especificaciones técnicas</h3>
        <dl className="detail__specs">
          {specs.map(({ label, value }) => (
            <div key={label} className="detail__spec">
              <dt className="mono-label">{label}</dt>
              <dd className="detail__spec-value">{formatValue(value)}</dd>
            </div>
          ))}
        </dl>

        <hr className="detail__divider" />

        <div className="detail__picker">
          <span className="mono-label">
            Color{selectedColor ? `: ${selectedColor.name}` : ''}
          </span>
          <div className="detail__swatches">
            {colors.map((color) => (
              <button
                key={color.code}
                type="button"
                title={color.name}
                aria-label={`Color ${color.name}`}
                aria-pressed={color.code === colorCode}
                className={`detail__swatch${color.code === colorCode ? ' detail__swatch--selected' : ''}`}
                style={{ backgroundColor: colorToHex(color.name) }}
                onClick={() => setColorCode(color.code)}
              />
            ))}
          </div>
        </div>

        <div className="detail__picker">
          <span className="mono-label">Almacenamiento</span>
          <div className="detail__storages">
            {storages.map((storage) => (
              <button
                key={storage.code}
                type="button"
                aria-pressed={storage.code === storageCode}
                className={`detail__storage${storage.code === storageCode ? ' detail__storage--selected' : ''}`}
                onClick={() => setStorageCode(storage.code)}
              >
                {storage.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="detail__add"
          onClick={handleAdd}
          disabled={addStatus === 'adding' || colorCode == null || storageCode == null}
        >
          {addStatus === 'adding' ? 'Añadiendo...' : 'Añadir a la cesta'}
        </button>
        {addStatus === 'added' && (
          <p className="detail__feedback">Producto añadido a la cesta.</p>
        )}
        {addStatus === 'error' && (
          <p className="detail__feedback detail__feedback--error">
            No se pudo añadir el producto. Inténtalo de nuevo.
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
