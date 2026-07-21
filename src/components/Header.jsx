import { Link, useMatch } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import cartIcon from '../assets/icons/cart.svg'
import './Header.css'

function Header() {
  const { count } = useCart()
  const isDetail = useMatch('/product/:id')

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <Link to="/" className="header__logo">
            TechSpecs
          </Link>
          <nav className="header__nav" aria-label="breadcrumb">
            <Link to="/" className="header__link">
              Smartphones
            </Link>
            {isDetail && <span className="header__crumb">/ Detalle</span>}
          </nav>
        </div>
        <div className="header__cart" aria-label={`Cesta: ${count} productos`}>
          <img src={cartIcon} alt="" className="header__cart-icon" />
          {count > 0 && <span className="header__cart-badge">{count}</span>}
        </div>
      </div>
    </header>
  )
}

export default Header
