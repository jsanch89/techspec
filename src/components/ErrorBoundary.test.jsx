import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary.jsx'

function Boom() {
  throw new Error('render exploded')
}

describe('ErrorBoundary', () => {
  it('renderiza los hijos cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <p>Contenido correcto</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Contenido correcto')).toBeInTheDocument()
  })

  it('muestra el fallback cuando un hijo lanza al renderizar', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Algo ha ido mal')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recargar' })).toBeInTheDocument()
    errorSpy.mockRestore()
  })
})
