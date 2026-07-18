const PREFIX = 'techspec-cache:'
export const CACHE_TTL = 60 * 60 * 1000 // 1 hora

export function getCached(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { timestamp, data } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function setCached(key, data) {
  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify({ timestamp: Date.now(), data }),
    )
  } catch {
    // localStorage lleno o no disponible: se ignora, la app funciona sin cache
  }
}
