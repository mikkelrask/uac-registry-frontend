// ---- Mod types (from worker /api/mods, /api/families, /api/search) ----

export interface ModEntry {
  hash: string
  family_name: string
  display_name: string
  category: string | null
  version: string | null
  is_sidecar: number
  url?: string
  domain?: string
  urls?: { url: string; domain: string }[]
  load_order?: Record<string, string>
  submitted_at?: number
  approved_at?: number
}

export interface ModFamily {
  id: string
  name: string
  category: string | null
  description?: string | null
  author?: string | null
  website?: string | null
  thumbnail_url?: string | null
  created_at?: number
  mod_count?: number
}

// Real API returns a flat object with versions (not mods) and family fields at top level
export interface FamilyDetail extends ModFamily {
  is_sidecar: number
  screenshots: Screenshot[]
  versions: ModEntry[]
}

export interface Screenshot {
  id: string
  family_id: string
  url: string
  caption: string | null
  sort_order: number
}

// ---- Protocol types (from worker /api/protocols) ----

export interface ProtocolMod {
  id: string
  mod_hash: string | null
  display_name: string
  download_url: string
  sort_order: number
}

export interface ProtocolIwad {
  id: string
  iwad: string
  is_required: number
}

export interface ProtocolPort {
  id: string
  source_port: string
  is_required: number
}

export interface ProtocolTag {
  id: string
  tag: string
}

export interface Protocol {
  id: string
  title: string
  slug: string
  description: string | null
  author: string | null
  protocol_json: string
  thumbnail_url: string | null
  created_at: number
  updated_at: number
}

export interface ProtocolDetail extends Protocol {
  mods: ProtocolMod[]
  iwads: ProtocolIwad[]
  ports: ProtocolPort[]
  tags: ProtocolTag[]
}

// ---- Search ----

export interface SearchResult {
  type: 'mod' | 'protocol'
  mod?: ModEntry
  family?: ModFamily
  protocol?: Protocol
}

// ---- API response wrappers ----

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export interface ApiError {
  error: string
  status: number
}

// ---- Install types ----

export interface InstallMessage {
  type: 'uac-install'
  protocolUrl: string
}
