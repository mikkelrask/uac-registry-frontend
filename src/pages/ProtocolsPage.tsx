import { useSearchParams } from 'react-router-dom'
import { useProtocols, useTags } from '@/hooks/useRegistryAPI'
import { ProtocolCard } from '@/components/ProtocolCard'
import { FilterPanel } from '@/components/FilterPanel'
import { Pagination } from '@/components/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Cpu } from 'lucide-react'

const DEFAULT_LIMIT = 12
const PAGE_SIZE_OPTIONS = [6, 12, 24, 48]

export function ProtocolsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') || undefined
  const port = searchParams.get('port') || undefined
  const iwad = searchParams.get('iwad') || undefined
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const { data, isLoading } = useProtocols({
    tag,
    port,
    iwad,
    limit: String(limit),
    offset: String(offset),
  })
  const { data: tags } = useTags()

  const protocols = data?.protocols
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const page = Math.floor(offset / limit) + 1

  const updateParams = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams)
    mutate(p)
    setSearchParams(p)
  }

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages)
    updateParams((p) => p.set('offset', String((clamped - 1) * limit)))
  }

  const changePageSize = (size: number) => {
    updateParams((p) => {
      // Keep the first item of the current page in view
      const firstItem = offset
      p.set('limit', String(size))
      p.set('offset', String(Math.floor(firstItem / size) * size))
    })
  }

  const changeFilter = (key: string, value: string | null) => {
    updateParams((p) => {
      if (value) p.set(key, value)
      else p.delete(key)
      p.delete('offset')
    })
  }

  const hasFilter = Boolean(tag || port || iwad)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="storefront-section-title">
        <Cpu className="size-5 text-accent-highlight" />
        Protocols
      </div>

      <FilterPanel
        tags={tags ?? []}
        activeTag={tag}
        activePort={port}
        activeIwad={iwad}
        onTagChange={(t) => changeFilter('tag', t)}
        onPortChange={(p) => changeFilter('port', p)}
        onIwadChange={(w) => changeFilter('iwad', w)}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : protocols?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((p) => (
            <ProtocolCard key={p.id} protocol={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border bg-card/30">
          <Cpu className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {hasFilter ? 'No protocols match these filters.' : 'No protocols yet.'}
          </p>
        </div>
      )}

      {!isLoading && total > 0 && (
        <Pagination
          page={page}
          pageSize={limit}
          total={total}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  )
}
