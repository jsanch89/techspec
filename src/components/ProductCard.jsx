import { Link } from 'react-router-dom'
import cartWhiteIcon from '../assets/icons/cart-white.svg'
import './ProductCard.css'

function ProductCard({ product }) {
  const { id, brand, model, price, imgUrl } = product

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={imgUrl} alt={`${brand} ${model}`} className="product-card__image" />
      </div>
      <span className="mono-label">{brand}</span>
      <h3 className="product-card__model">{model}</h3>
      <div className="product-card__footer">
        <span className="product-card__price">{price ? `${price} €` : '—'}</span>
        <span className="product-card__button" aria-hidden="true">
          <img src={cartWhiteIcon} alt="" />
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
