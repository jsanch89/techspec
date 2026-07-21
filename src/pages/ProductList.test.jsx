import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductList from './ProductList.jsx'

vi.mock('../api/client', () => ({
  getProducts: vi.fn(),
}))

import { getProducts } from '../api/client'

const PRODUCTS = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'a.jpg' },
  { id: '2', brand: 'Apple', model: 'iPhone 15 Pro', price: '1299', imgUrl: 'b.jpg' },
  { id: '3', brand: 'Samsung', model: 'Galaxy S24', price: '999', imgUrl: 'c.jpg' },
]

function renderList() {
  return render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>,
  )
}

describe('ProductList', () => {
  beforeEach(() => {
    getProducts.mockResolvedValue(PRODUCTS)
  })

  it('renderiza los productos del API', async () => {
    renderList()
    expect(await screen.findByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument()
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
  })

  it('filtra por marca tras el debounce', async () => {
    renderList()
    await screen.findByText('iPhone 15 Pro')

    await userEvent.type(screen.getByRole('searchbox'), 'samsung')

    await waitFor(() =>
      expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument(),
    )
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
    expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument()
  })

  it('filtra por modelo tras el debounce', async () => {
    renderList()
    await screen.findByText('iPhone 15 Pro')

    await userEvent.type(screen.getByRole('searchbox'), 'iphone')

    await waitFor(() => expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument())
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
  })

  it('muestra mensaje sin resultados', async () => {
    renderList()
    await screen.findByText('iPhone 15 Pro')

    await userEvent.type(screen.getByRole('searchbox'), 'nokia')

    expect(await screen.findByText(/Sin resultados/)).toBeInTheDocument()
  })
})
