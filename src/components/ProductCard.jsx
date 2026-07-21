import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProduct, addToCart } from '../api/client'
import { useCart } from '../context/CartContext.jsx'
import cartWhiteIcon from '../assets/icons/cart-white.svg'
import './ProductCard.css'

function ProductCard({ product }) {
  const { id, brand, model, price, imgUrl } = product
  const { updateCount } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAdd = async (event) => {
    // Evita que el click navegue al detalle (la tarjeta entera es un Link)
    event.preventDefault()
    event.stopPropagation()
    if (adding) return
    setAdding(true)
    try {
      const detail = await getProduct(id)
      const color = detail.options?.colors?.[0]
      const storage = detail.options?.storages?.[0]
      const { count } = await addToCart({
        id,
        colorCode: color?.code,
        storageCode: storage?.code,
      })
      updateCount(count)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={imgUrl} alt={`${brand} ${model}`} className="product-card__image" />
      </div>
      <span className="mono-label">{brand}</span>
      <h3 className="product-card__model">{model}</h3>
      <div className="product-card__footer">
        <span className="product-card__price">{price ? `${price} €` : '—'}</span>
        <button
          type="button"
          className="product-card__button"
          onClick={handleAdd}
          disabled={adding}
          aria-label={`Añadir ${brand} ${model} a la cesta`}
        >
          <img src={cartWhiteIcon} alt="" />
        </button>
      </div>
    </Link>
  )
}

export default ProductCard
