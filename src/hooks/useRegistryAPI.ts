import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import type {
  ModEntry,
  ModFamily,
  FamilyDetail,
  ModFileDetail,
  Protocol,
  ProtocolDetail,
  Screenshot,
  SearchResult,
} from '@/lib/types'

// ---- Mod families ----

export function useFamilies(params?: { category?: string; limit?: string; offset?: string }) {
  return useQuery<ModFamily[]>({
    queryKey: ['families', params],
    queryFn: async () => {
      const data = await apiGet<{ families: ModFamily[]; total: number; limit: number; offset: number }>(
        '/api/families', params,
      )
      return data.families
    },
  })
}

export function useFamilyDetail(id: string) {
  return useQuery<FamilyDetail>({
    queryKey: ['family', id],
    queryFn: () => apiGet(`/api/families/${id}`),
    enabled: !!id,
  })
}

export function useFamilyScreenshots(familyId: string) {
  return useQuery<Screenshot[]>({
    queryKey: ['screenshots', familyId],
    queryFn: () => apiGet(`/api/families/${familyId}/screenshots`),
    enabled: !!familyId,
  })
}

// ---- Mods ----

export function useMods(params?: { q?: string; category?: string; limit?: string; offset?: string }) {
  return useQuery<ModEntry[]>({
    queryKey: ['mods', params],
    queryFn: () => apiGet('/api/mods', params),
  })
}

export function useModDetail(hash: string) {
  return useQuery<ModFileDetail>({
    queryKey: ['mod', hash],
    queryFn: () => apiGet(`/mod/${hash}`),
    enabled: !!hash,
  })
}

// ---- Protocols ----

export function useProtocols(params?: { tag?: string; port?: string; iwad?: string; featured?: string }) {
  return useQuery<Protocol[]>({
    queryKey: ['protocols', params],
    queryFn: () => apiGet('/api/protocols', params),
  })
}

export function useProtocolDetail(slug: string) {
  return useQuery<ProtocolDetail>({
    queryKey: ['protocol', slug],
    queryFn: () => apiGet(`/api/protocols/${slug}`),
    enabled: !!slug,
  })
}

// ---- Search ----

export function useSearch(q: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['search', q],
    queryFn: async () => {
      const data = await apiGet<{
        mods: (ModEntry & { type: 'mod' })[]
        protocols: (Protocol & { type: 'protocol' })[]
        total_mods: number
        total_protocols: number
      }>('/api/search', { q })
      return [
        ...data.mods.map((m) => ({ type: 'mod' as const, mod: m })),
        ...data.protocols.map((p) => ({ type: 'protocol' as const, protocol: p })),
      ]
    },
    enabled: q.length > 0,
  })
}

// ---- Categories & tags ----

export function useCategories() {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: () => apiGet('/api/categories'),
    staleTime: 5 * 60_000,
  })
}

export function useTags() {
  return useQuery<string[]>({
    queryKey: ['tags'],
    queryFn: () => apiGet('/api/tags'),
    staleTime: 5 * 60_000,
  })
}
