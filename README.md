# TechSpecs — Mini-app de compra de dispositivos móviles

SPA en React para visualizar, buscar y comprar dispositivos móviles, integrada con el API
`https://itx-frontend-test.onrender.com`.

## Vistas

- **Listado** (`/`): grid de productos con buscador que filtra en tiempo real por marca y modelo.
- **Detalle** (`/product/:id`): imagen, especificaciones técnicas, selectores de color y
  almacenamiento y botón para añadir a la cesta.

El contador de la cesta se muestra en la cabecera en todas las vistas y se persiste
en `localStorage`.

## Stack

- React 18 + Vite (JavaScript)
- `react-router-dom` para enrutado cliente (SPA)
- Vitest + Testing Library para tests
- ESLint
- CSS plano, sin dependencias de UI

## Scripts

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run start` | Arranca el entorno de desarrollo     |
| `npm run build` | Genera la build de producción        |
| `npm run test`  | Ejecuta la suite de tests            |
| `npm run lint`  | Ejecuta el linter                    |

## Arquitectura

```
src/
├── main.jsx                 # BrowserRouter + CartProvider + rutas
├── App.jsx                  # Layout: Header + <Routes>
├── api/client.js            # Endpoints: getProducts, getProduct, addToCart
├── api/cache.js             # Cache en localStorage con expiración de 1 hora
├── context/CartContext.jsx  # Contador de cesta, persistido en localStorage
├── components/              # Header, ProductCard, SearchBar
└── pages/                   # ProductList, ProductDetail
```

## Cache de peticiones

Las peticiones GET (listado y detalle de producto) se cachean en `localStorage` con una
expiración de **1 hora**. Cada entrada guarda el timestamp de escritura; si al leerla
ha pasado más de una hora, se descarta y se vuelve a pedir al API.

El contador de la cesta también se persiste en `localStorage` para sobrevivir a recargas.
