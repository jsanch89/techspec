import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import ProductCard from './ProductCard.jsx'

vi.mock('../api/client', () => ({
  getProduct: vi.fn(),
  addToCart: vi.fn(),
}))

import { getProduct, addToCart } from '../api/client'

const PRODUCT = { id: 'abc1', brand: 'Acer', model: 'Liquid Z6 Plus', price: '250', imgUrl: 'a.jpg' }

const DETAIL = {
  ...PRODUCT,
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'White' },
    ],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
}

function renderCard() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={PRODUCT} />
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
    getProduct.mockResolvedValue(DETAIL)
    addToCart.mockResolvedValue({ count: 1 })
  })

  it('añade a la cesta con las opciones por defecto y persiste el item', async () => {
    renderCard()

    await userEvent.click(
      screen.getByRole('button', { name: 'Añadir Acer Liquid Z6 Plus a la cesta' }),
    )

    expect(getProduct).toHaveBeenCalledWith('abc1')
    expect(addToCart).toHaveBeenCalledWith({
      id: 'abc1',
      colorCode: 1000,
      storageCode: 2000,
    })
    const stored = JSON.parse(localStorage.getItem('techspec-cart-items'))
    expect(stored).toEqual([
      expect.objectContaining({
        id: 'abc1',
        model: 'Liquid Z6 Plus',
        colorName: 'Black',
        storageName: '16 GB',
        qty: 1,
      }),
    ])
    expect(localStorage.getItem('techspec-cart-count')).toBe('1')
  })
})
