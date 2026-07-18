import searchIcon from '../assets/icons/search.svg'
import './SearchBar.css'

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <img src={searchIcon} alt="" className="search-bar__icon" />
      <input
        type="search"
        className="search-bar__input"
        placeholder="Filtrar por marca o modelo..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar productos"
      />
    </div>
  )
}

export default SearchBar
