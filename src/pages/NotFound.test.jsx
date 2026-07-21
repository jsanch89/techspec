import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound.jsx'

describe('NotFound', () => {
  it('muestra el mensaje y un enlace de vuelta al listado', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByText('La página que buscas no existe.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al listado' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
