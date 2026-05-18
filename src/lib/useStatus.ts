import { useEffect, useState } from 'react'
import { api, type GateStatus } from './api'

export interface HackathonStatus {
  registration: GateStatus
  submission:   GateStatus
}

const FALLBACK: HackathonStatus = { registration: 'locked', submission: 'locked' }

interface CacheEntry {
  data: HackathonStatus
  fetched_at: number
}
let cache: CacheEntry | null = null
const TTL_MS = 60_000

export function useStatus(): { status: HackathonStatus; loading: boolean } {
  const [status, setStatus]   = useState<HackathonStatus>(() => cache?.data ?? FALLBACK)
  const [loading, setLoading] = useState<boolean>(() => !cache || Date.now() - cache.fetched_at > TTL_MS)

  useEffect(() => {
    if (cache && Date.now() - cache.fetched_at < TTL_MS) {
      setStatus(cache.data); setLoading(false); return
    }
    let alive = true
    api.status().then((raw) => {
      const r = raw as Record<string, unknown>
      const inner = (r.result && typeof r.result === 'object' ? r.result as Record<string, unknown> : r)
      const data: HackathonStatus = {
        registration: (inner.registration as GateStatus) ?? 'locked',
        submission:   (inner.submission   as GateStatus) ?? 'locked',
      }
      cache = { data, fetched_at: Date.now() }
      if (alive) { setStatus(data); setLoading(false) }
    }).catch(() => {
      if (alive) { setLoading(false) /* keep FALLBACK */ }
    })
    return () => { alive = false }
  }, [])

  return { status, loading }
}
