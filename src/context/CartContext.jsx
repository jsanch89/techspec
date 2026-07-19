import { createContext, useCallback, useContext, useState } from 'react'

const CART_COUNT_KEY = 'techspec-cart-count'
const CART_ITEMS_KEY = 'techspec-cart-items'

const CartContext = createContext({
  count: 0,
  items: [],
  isOpen: false,
  updateCount: () => {},
  addItem: () => {},
  removeItem: () => {},
  changeQty: () => {},
  openCart: () => {},
  closeCart: () => {},
})

export function itemKey({ id, colorCode, storageCode }) {
  return `${id}-${colorCode}-${storageCode}`
}

function readStoredItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_ITEMS_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [count, setCount] = useState(() => {
    const stored = Number(localStorage.getItem(CART_COUNT_KEY))
    return Number.isFinite(stored) && stored > 0 ? stored : 0
  })
  const [items, setItems] = useState(readStoredItems)
  const [isOpen, setIsOpen] = useState(false)

  const updateCount = useCallback((value) => {
    setCount(value)
    localStorage.setItem(CART_COUNT_KEY, String(value))
  }, [])

  const persistItems = useCallback(
    (nextItems) => {
      setItems(nextItems)
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(nextItems))
      const total = nextItems.reduce((sum, item) => sum + item.qty, 0)
      updateCount(total)
    },
    [updateCount],
  )

  const addItem = useCallback(
    (item) => {
      const key = itemKey(item)
      const existing = items.find((entry) => itemKey(entry) === key)
      const nextItems = existing
        ? items.map((entry) =>
            itemKey(entry) === key ? { ...entry, qty: entry.qty + 1 } : entry,
          )
        : [...items, { ...item, qty: 1 }]
      persistItems(nextItems)
    },
    [items, persistItems],
  )

  const removeItem = useCallback(
    (key) => {
      persistItems(items.filter((entry) => itemKey(entry) !== key))
    },
    [items, persistItems],
  )

  const changeQty = useCallback(
    (key, delta) => {
      persistItems(
        items.map((entry) =>
          itemKey(entry) === key
            ? { ...entry, qty: Math.max(1, entry.qty + delta) }
            : entry,
        ),
      )
    },
    [items, persistItems],
  )

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider
      value={{
        count,
        items,
        isOpen,
        updateCount,
        addItem,
        removeItem,
        changeQty,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
