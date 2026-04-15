import { useState, useEffect } from 'react'

const STORAGE_KEY = 'js_carwash_promo_countdown_end'
const DEFAULT_DURATION_MS = 72 * 60 * 60 * 1000

function getLocalFallbackEndTime(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const t = parseInt(stored, 10)
      if (!Number.isNaN(t) && t > Date.now()) return t
    }
    const end = Date.now() + DEFAULT_DURATION_MS
    localStorage.setItem(STORAGE_KEY, String(end))
    return end
  } catch {
    return Date.now() + DEFAULT_DURATION_MS
  }
}

function computeRemaining(startMs: number | null, endMs: number | null): number {
  const now = Date.now()
  if (startMs != null && !Number.isNaN(startMs) && now < startMs) {
    return Math.max(0, startMs - now)
  }
  if (endMs != null && !Number.isNaN(endMs)) {
    return Math.max(0, endMs - now)
  }
  return Math.max(0, getLocalFallbackEndTime() - now)
}

/** Pass server start/end (ms). Before start it counts down to start, then counts to end. */
export function usePromoCountdown(startMs: number | null, endMs: number | null) {
  const [remaining, setRemaining] = useState(() => computeRemaining(startMs, endMs))
  const [phase, setPhase] = useState<'not_started' | 'running' | 'expired'>(() => {
    const now = Date.now()
    if (startMs != null && !Number.isNaN(startMs) && now < startMs) return 'not_started'
    if (endMs != null && !Number.isNaN(endMs) && now <= endMs) return 'running'
    return 'expired'
  })

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      setRemaining(computeRemaining(startMs, endMs))
      if (startMs != null && !Number.isNaN(startMs) && now < startMs) {
        setPhase('not_started')
      } else if (endMs != null && !Number.isNaN(endMs) && now <= endMs) {
        setPhase('running')
      } else {
        setPhase('expired')
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [startMs, endMs])

  const totalSeconds = Math.floor(remaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { hours, minutes, seconds, expired: phase === 'expired', phase }
}
