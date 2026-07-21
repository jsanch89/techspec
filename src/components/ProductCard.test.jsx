import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

const PRODUCT = {
  id: 'abc1',
  brand: 'Acer',
  model: 'Liquid Z6 Plus',
  price: '250',
  imgUrl: 'a.jpg',
}

function renderCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={PRODUCT} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('muestra marca, modelo y precio', () => {
    renderCard()
    expect(screen.getByText('Acer')).toBeInTheDocument()
    expect(screen.getByText('Liquid Z6 Plus')).toBeInTheDocument()
    expect(screen.getByText('250 €')).toBeInTheDocument()
  })

  it('enlaza al detalle del producto', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/abc1')
  })
})
