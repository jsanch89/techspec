import { Component } from 'react'
import './ErrorBoundary.css'

// Captura errores de render que de otro modo dejarían la app en blanco.
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error no controlado en la UI:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page error-boundary">
          <h1 className="error-boundary__title">Algo ha ido mal</h1>
          <p className="error-boundary__text">
            Ha ocurrido un error inesperado. Recarga la página para volver a intentarlo.
          </p>
          <button
            type="button"
            className="error-boundary__button"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
