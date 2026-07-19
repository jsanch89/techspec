import { useCart, itemKey } from '../context/CartContext.jsx'
import closeIcon from '../assets/icons/close.svg'
import './CartPanel.css'

function CartPanel() {
  const { items, isOpen, closeCart, removeItem, changeQty } = useCart()

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.qty,
    0,
  )

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? ' cart-overlay--open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-panel${isOpen ? ' cart-panel--open' : ''}`}
        aria-label="Cesta"
        aria-hidden={!isOpen}
      >
        <div className="cart-panel__header">
          <h2 className="cart-panel__title">Tu cesta</h2>
          <button
            type="button"
            className="cart-panel__close"
            onClick={closeCart}
            aria-label="Cerrar cesta"
          >
            <img src={closeIcon} alt="" className="cart-panel__close-icon" />
          </button>
        </div>

        <div className="cart-panel__body">
          {items.length === 0 && (
            <p className="cart-panel__empty">Tu cesta está vacía.</p>
          )}
          {items.map((item) => {
            const key = itemKey(item)
            const options = [item.colorName, item.storageName]
              .filter(Boolean)
              .join(' / ')
            return (
              <article key={key} className="cart-item">
                <div className="cart-item__image-box">
                  <img
                    src={item.imgUrl}
                    alt={`${item.brand} ${item.model}`}
                    className="cart-item__image"
                  />
                </div>
                <div className="cart-item__info">
                  <div className="cart-item__row">
                    <h4 className="cart-item__name">{item.model}</h4>
                    <span className="cart-item__price">
                      {item.price ? `${item.price} €` : '—'}
                    </span>
                  </div>
                  <p className="cart-item__options">{options}</p>
                  <div className="cart-item__actions">
                    <div className="cart-item__stepper">
                      <button
                        type="button"
                        className="cart-item__step"
                        onClick={() => changeQty(key, -1)}
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <span className="cart-item__qty">{item.qty}</span>
                      <button
                        type="button"
                        className="cart-item__step"
                        onClick={() => changeQty(key, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeItem(key)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="cart-panel__footer">
          <div className="cart-panel__subtotal">
            <span className="cart-panel__subtotal-label">Subtotal</span>
            <span className="cart-panel__subtotal-value">{subtotal} €</span>
          </div>
          <button
            type="button"
            className="cart-panel__checkout"
            disabled={items.length === 0}
          >
            Finalizar compra
          </button>
          <p className="cart-panel__note">
            Envío e impuestos calculados al finalizar la compra
          </p>
        </div>
      </aside>
    </>
  )
}

export default CartPanel
