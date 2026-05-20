const WINDMILL_BASE = 'https://windmill.team.infrared.city/api/w/ir-main'

export type GateStatus = 'locked' | 'open' | 'closed'

// Windmill webhook endpoints (scoped tokens set as env vars).
// `run_wait_result` is synchronous — body contains the script return value directly.
const ENDPOINTS = {
  requestKey:          `${WINDMILL_BASE}/jobs/run_wait_result/p/f/hackathon/request_key`,
  submitProject:       `${WINDMILL_BASE}/jobs/run_wait_result/p/f/hackathon/submit_project`,
  registerParticipant: `${WINDMILL_BASE}/jobs/run_wait_result/p/f/hackathon/register_participant`,
  notifyMe:            `${WINDMILL_BASE}/jobs/run_wait_result/p/f/hackathon/notify_me`,
  status:              `${WINDMILL_BASE}/jobs/run_wait_result/p/f/hackathon/status`,
}

// NocoDB public read (read-only token, safe to expose)
const NOCODB_BASE = 'https://nocodb.team.infrared.city/api/v2'
const NOCODB_READ_TOKEN = import.meta.env.VITE_NOCODB_READ_TOKEN ?? ''
const NOCO_WAITLIST_TABLE = 'mrw0yjngib2o7pi'

async function windmill(endpoint: string, body: unknown) {
  const token = import.meta.env.VITE_WINDMILL_TRIGGER_TOKEN ?? ''
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Windmill error: ${res.status}`)
  return res.json()
}

async function nocoGet(tableId: string, params = '') {
  const res = await fetch(`${NOCODB_BASE}/tables/${tableId}/records?${params}`, {
    headers: { 'xc-token': NOCODB_READ_TOKEN },
  })
  if (!res.ok) throw new Error(`NocoDB error: ${res.status}`)
  return res.json()
}

export const api = {
  requestKey: (body: {
    team_name: string
    email: string
    nickname: string
    skills: string[]
    project_idea?: string
    looking_for_team: boolean
  }) => windmill(ENDPOINTS.requestKey, body),

  submitProject: (body: unknown) =>
    windmill(ENDPOINTS.submitProject, body),

  registerParticipant: (body: { nickname: string; skills: string[]; looking_for_team: boolean }) =>
    windmill(ENDPOINTS.registerParticipant, body),

  notifyMe: (body: { email: string; name?: string; source: 'landing' | 'getkey' | 'footer' }) =>
    windmill(ENDPOINTS.notifyMe, body),

  status: () => windmill(ENDPOINTS.status, {}) as Promise<{ registration: GateStatus; submission: GateStatus }>,

  getParticipants: () =>
    nocoGet(import.meta.env.VITE_NOCO_PARTICIPANTS_TABLE ?? '', 'limit=200&sort=-registered_at'),

  getSubmissions: () =>
    nocoGet(import.meta.env.VITE_NOCO_SUBMISSIONS_TABLE ?? '', 'limit=200&sort=-submitted_at'),

  getWaitlistCount: async (): Promise<number> => {
    const d = await nocoGet(NOCO_WAITLIST_TABLE, 'limit=1')
    return (d?.pageInfo?.totalRows as number) ?? 0
  },
}
