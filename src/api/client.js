import { getCached, setCached } from './cache'

const BASE_URL = 'https://itx-frontend-test.onrender.com'

async function getWithCache(path) {
  const cached = getCached(path)
  if (cached) return cached
  const res = await fetch(BASE_URL + path)
  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${path}`)
  const data = await res.json()
  setCached(path, data)
  return data
}

export function getProducts() {
  return getWithCache('/api/product')
}

export function getProduct(id) {
  return getWithCache(`/api/product/${id}`)
}

export async function addToCart({ id, colorCode, storageCode }) {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  })
  if (!res.ok) throw new Error(`Error ${res.status} al añadir a la cesta`)
  return res.json()
}
