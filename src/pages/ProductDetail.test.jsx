import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import ProductDetail from './ProductDetail.jsx'

vi.mock('../api/client', () => ({
  getProduct: vi.fn(),
  addToCart: vi.fn(),
}))

import { getProduct, addToCart } from '../api/client'

const PRODUCT = {
  id: 'abc1',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'a.jpg',
  cpu: 'Quad-core 1.3 GHz',
  ram: '2 GB RAM',
  os: 'Android 6.0',
  displayResolution: '720 x 1280 pixels',
  battery: '3400 mAh',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: '2 MP',
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
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

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/product/abc1']}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('ProductDetail', () => {
  beforeEach(() => {
    localStorage.clear()
    getProduct.mockResolvedValue(PRODUCT)
    addToCart.mockResolvedValue({ count: 1 })
  })

  it('renderiza título, precio y especificaciones', async () => {
    renderDetail()
    expect(await screen.findByText('Iconia Talk S')).toBeInTheDocument()
    expect(screen.getByText('170 €')).toBeInTheDocument()
    expect(screen.getByText('Quad-core 1.3 GHz')).toBeInTheDocument()
    expect(screen.getByText('13 MP, autofocus')).toBeInTheDocument()
  })

  it('selecciona la primera opción de color y almacenamiento por defecto', async () => {
    renderDetail()
    await screen.findByText('Iconia Talk S')

    expect(screen.getByRole('button', { name: 'Color Black' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '16 GB' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('añade a la cesta con los códigos seleccionados por defecto', async () => {
    renderDetail()
    await screen.findByText('Iconia Talk S')

    await userEvent.click(screen.getByRole('button', { name: 'Añadir a la cesta' }))

    expect(addToCart).toHaveBeenCalledWith({
      id: 'abc1',
      colorCode: 1000,
      storageCode: 2000,
    })
    expect(await screen.findByText('Producto añadido a la cesta.')).toBeInTheDocument()
    expect(localStorage.getItem('techspec-cart-count')).toBe('1')
  })

  it('añade a la cesta con las opciones cambiadas por el usuario', async () => {
    renderDetail()
    await screen.findByText('Iconia Talk S')

    await userEvent.click(screen.getByRole('button', { name: 'Color White' }))
    await userEvent.click(screen.getByRole('button', { name: '32 GB' }))
    await userEvent.click(screen.getByRole('button', { name: 'Añadir a la cesta' }))

    expect(addToCart).toHaveBeenCalledWith({
      id: 'abc1',
      colorCode: 1001,
      storageCode: 2001,
    })
  })
})
