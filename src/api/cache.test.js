import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { getCached, setCached, CACHE_TTL } from './cache'

describe('api/cache', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('devuelve el dato cacheado antes de expirar', () => {
    setCached('/api/product', [{ id: '1' }])
    expect(getCached('/api/product')).toEqual([{ id: '1' }])
  })

  it('devuelve null si no hay entrada', () => {
    expect(getCached('/api/product')).toBeNull()
  })

  it('expira la entrada pasada 1 hora', () => {
    setCached('/api/product', [{ id: '1' }])
    vi.advanceTimersByTime(CACHE_TTL + 1)
    expect(getCached('/api/product')).toBeNull()
  })

  it('no expira justo antes de 1 hora', () => {
    setCached('/api/product', [{ id: '1' }])
    vi.advanceTimersByTime(CACHE_TTL - 1)
    expect(getCached('/api/product')).toEqual([{ id: '1' }])
  })
})
