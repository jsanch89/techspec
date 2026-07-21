import { getCached, setCached } from './cache'

const BASE_URL = 'https://itx-frontend-test.onrender.com'
// El backend está en Render y puede tardar por cold start; sin timeout el
// spinner se quedaría colgado indefinidamente.
const REQUEST_TIMEOUT = 12000

export class ApiError extends Error {
  constructor(message, { status = 0, notFound = false, timeout = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.notFound = notFound
    this.timeout = timeout
  }
}

async function request(path, options, description) {
  const label = description ?? `pedir ${path}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const res = await fetch(BASE_URL + path, { ...options, signal: controller.signal })
    if (!res.ok) {
      throw new ApiError(`Error ${res.status} al ${label}`, {
        status: res.status,
        notFound: res.status === 404,
      })
    }
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(`Tiempo de espera agotado al ${label}`, { timeout: true })
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

async function getWithCache(path) {
  const cached = getCached(path)
  if (cached) return cached
  const data = await request(path)
  setCached(path, data)
  return data
}

export function getProducts() {
  return getWithCache('/api/product')
}

export function getProduct(id) {
  return getWithCache(`/api/product/${id}`)
}

export function addToCart({ id, colorCode, storageCode }) {
  return request(
    '/api/cart',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, colorCode, storageCode }),
    },
    'añadir a la cesta',
  )
}
