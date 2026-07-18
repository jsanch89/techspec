import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext.jsx'

function CartProbe() {
  const { count, updateCount } = useCart()
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => updateCount(5)}>update</button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('arranca en 0 sin valor persistido', () => {
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('lee el valor persistido en localStorage', () => {
    localStorage.setItem('techspec-cart-count', '3')
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>,
    )
    expect(screen.getByTestId('count')).toHaveTextContent('3')
  })

  it('actualiza el contador y lo persiste', () => {
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>,
    )
    act(() => {
      screen.getByRole('button', { name: 'update' }).click()
    })
    expect(screen.getByTestId('count')).toHaveTextContent('5')
    expect(localStorage.getItem('techspec-cart-count')).toBe('5')
  })
})
