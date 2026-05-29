export interface Participant {
  id?: string
  nickname: string
  skills: string[]
  looking_for_team: boolean
  registered_at?: string
}

export interface Submission {
  id?: string
  project_name: string
  one_liner: string
  team_name: string
  members: string
  github_url: string
  demo_url?: string
  video_url?: string
  screenshots?: string[]
  documents?: string
  apis_used: string[]
  challenge_track: string
  // Richer description (added for the upload-enabled submission form)
  problem?: string
  solution?: string
  tech_impl?: string
  target_group?: string
  tags?: string
  sdk_feedback?: string
  prize_email?: string
  submitted_at?: string
  score?: number
}

export interface KeyRequest {
  team_name: string
  email: string
}

export interface KeyResponse {
  api_key: string
  key_name: string
}

export const SKILLS = [
  'Python', 'TypeScript', 'React', 'FastAPI', 'Gradio',
  'Machine Learning', 'GIS', 'Urban Planning', 'Architecture',
  'Data Viz', 'WebGL', 'Rust', 'Go', 'Climate Science',
]

export const APIS = [
  'Wind Speed', 'Pedestrian Wind Comfort', 'Daylight Availability',
  'Direct Sun Hours', 'Sky View Factor', 'Solar Radiation',
  'UTCI', 'Thermal Comfort Statistics',
]

export const TRACKS = [
  'Urban Heat',
  'Wind & Pedestrian Safety',
  'Solar Access & Energy',
  'AI Agents & Urban Intelligence',
  'Digital Climate Twin',
  'Open',
]
