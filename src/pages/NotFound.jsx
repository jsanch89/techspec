import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page detail__status">
      <p>La página que buscas no existe.</p>
      <Link to="/" className="detail__back">
        Volver al listado
      </Link>
    </div>
  )
}

export default NotFound
