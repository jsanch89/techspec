import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../context/CartContext.jsx'
import CartPanel from './CartPanel.jsx'

const ITEMS = [
  {
    id: 'abc1',
    colorCode: 1000,
    storageCode: 2000,
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'a.jpg',
    colorName: 'Black',
    storageName: '16 GB',
    qty: 1,
  },
  {
    id: 'xyz2',
    colorCode: 1001,
    storageCode: 2001,
    brand: 'LG',
    model: 'K60',
    price: '130',
    imgUrl: 'b.jpg',
    colorName: 'White',
    storageName: '32 GB',
    qty: 2,
  },
]

function OpenCartButton() {
  const { openCart } = useCart()
  return <button onClick={openCart}>abrir</button>
}

function renderPanel() {
  return render(
    <CartProvider>
      <OpenCartButton />
      <CartPanel />
    </CartProvider>,
  )
}

describe('CartPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('techspec-cart-items', JSON.stringify(ITEMS))
    localStorage.setItem('techspec-cart-count', '3')
  })

  it('muestra los items persistidos con opciones y subtotal', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'abrir' }))

    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument()
    expect(screen.getByText('Black / 16 GB')).toBeInTheDocument()
    expect(screen.getByText('K60')).toBeInTheDocument()
    // 170 + 130 * 2
    expect(screen.getByText('430 €')).toBeInTheDocument()
  })

  it('muestra la cesta vacía cuando no hay items', async () => {
    localStorage.clear()
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'abrir' }))

    expect(screen.getByText('Tu cesta está vacía.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finalizar compra' })).toBeDisabled()
  })

  it('incrementa la cantidad y actualiza subtotal y contador', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'abrir' }))

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Aumentar cantidad' })[0],
    )

    expect(screen.getByText('600 €')).toBeInTheDocument()
    expect(localStorage.getItem('techspec-cart-count')).toBe('4')
  })

  it('no baja la cantidad de 1', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'abrir' }))

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Reducir cantidad' })[0],
    )

    expect(screen.getByText('430 €')).toBeInTheDocument()
  })

  it('elimina un item y lo persiste', async () => {
    renderPanel()
    await userEvent.click(screen.getByRole('button', { name: 'abrir' }))

    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument()
    expect(screen.getByText('260 €')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('techspec-cart-items'))
    expect(stored).toHaveLength(1)
    expect(localStorage.getItem('techspec-cart-count')).toBe('2')
  })
})
