import { useEffect, useState } from 'react'
import { api, type GateStatus } from './api'

export interface HackathonStatus {
  registration: GateStatus
  submission:   GateStatus
}

// Optimistic time-based fallback so the page renders even if Windmill is slow.
// Kickoff: Wed May 27, 17:00 CET (= 15:00 UTC). Submission window: May 31, 17:00 CET -> May 31 24:00 CET.
// Server-side gate still enforces the real state on every write.
function clockFallback(): HackathonStatus {
  const now = Date.now()
  const kickoff   = Date.UTC(2026, 4, 27, 15, 0, 0)
  const submitOpen  = Date.UTC(2026, 4, 31, 15, 0, 0)
  const submitClose = Date.UTC(2026, 4, 31, 22, 0, 0)
  return {
    registration: now < kickoff ? 'locked' : 'open',
    submission:   now < submitOpen ? 'locked' : (now < submitClose ? 'open' : 'closed'),
  }
}

interface CacheEntry {
  data: HackathonStatus
  fetched_at: number
}
let cache: CacheEntry | null = null
const TTL_MS = 60_000
const FETCH_TIMEOUT_MS = 4_000

export function useStatus(): { status: HackathonStatus; loading: boolean } {
  const [status, setStatus]   = useState<HackathonStatus>(() => cache?.data ?? clockFallback())
  const [loading, setLoading] = useState<boolean>(() => !cache || Date.now() - cache.fetched_at > TTL_MS)

  useEffect(() => {
    if (cache && Date.now() - cache.fetched_at < TTL_MS) {
      setStatus(cache.data); setLoading(false); return
    }
    let alive = true
    let settled = false
    const timer = setTimeout(() => {
      if (!alive || settled) return
      settled = true
      setLoading(false) // keep clockFallback until the slow fetch resolves
    }, FETCH_TIMEOUT_MS)

    api.status().then((raw) => {
      const r = raw as Record<string, unknown>
      const inner = (r.result && typeof r.result === 'object' ? r.result as Record<string, unknown> : r)
      const data: HackathonStatus = {
        registration: (inner.registration as GateStatus) ?? clockFallback().registration,
        submission:   (inner.submission   as GateStatus) ?? clockFallback().submission,
      }
      cache = { data, fetched_at: Date.now() }
      if (!alive) return
      setStatus(data)
      settled = true
      setLoading(false)
    }).catch(() => {
      if (!alive) return
      settled = true
      setLoading(false)
    })

    return () => { alive = false; clearTimeout(timer) }
  }, [])

  return { status, loading }
}
