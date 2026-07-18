import { createContext, useCallback, useContext, useState } from 'react'

const CART_COUNT_KEY = 'techspec-cart-count'

const CartContext = createContext({ count: 0, updateCount: () => {} })

export function CartProvider({ children }) {
  const [count, setCount] = useState(() => {
    const stored = Number(localStorage.getItem(CART_COUNT_KEY))
    return Number.isFinite(stored) && stored > 0 ? stored : 0
  })

  const updateCount = useCallback((value) => {
    setCount(value)
    localStorage.setItem(CART_COUNT_KEY, String(value))
  }, [])

  return (
    <CartContext.Provider value={{ count, updateCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
