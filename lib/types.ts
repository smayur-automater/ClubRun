export type Role = 'organiser' | 'member'
export type RSVPStatus = 'going' | 'not_going' | 'maybe'
export type RunStatus = 'scheduled' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  emergency_contact: string | null
  pb_5k: string | null
  pb_10k: string | null
  pb_half: string | null
  pb_full: string | null
}

export interface Club {
  id: string
  name: string
  description: string | null
  location: string | null
  created_by: string
  created_at: string
  logo_url: string | null
  invite_token: string
}

export interface ClubMember {
  id: string
  club_id: string
  user_id: string
  role: Role
  joined_at: string
  status: string
  profiles?: Profile
}

export interface PaceGroup {
  id: string
  run_id: string
  label: string
  min_pace: string | null
  max_pace: string | null
  leader_name: string | null
}

export interface Run {
  id: string
  club_id: string
  title: string
  date: string
  time: string
  meeting_point: string
  distance_km: number | null
  route_url: string | null
  notes: string | null
  status: RunStatus
  created_by: string
  created_at: string
  pace_groups?: PaceGroup[]
  rsvps?: RSVP[]
}

export interface RSVP {
  id: string
  run_id: string
  user_id: string
  pace_group_id: string | null
  status: RSVPStatus
  created_at: string
  profiles?: Profile
  pace_groups?: PaceGroup
}
