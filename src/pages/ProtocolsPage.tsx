import { useSearchParams } from 'react-router-dom'
import { useProtocols, useTags } from '@/hooks/useRegistryAPI'
import { ProtocolCard } from '@/components/ProtocolCard'
import { FilterPanel } from '@/components/FilterPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { Cpu } from 'lucide-react'

export function ProtocolsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') || undefined
  const port = searchParams.get('port') || undefined
  const iwad = searchParams.get('iwad') || undefined

  const { data: protocols, isLoading } = useProtocols({ tag, port, iwad })
  const { data: tags } = useTags()

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
        onTagChange={(t) => {
          const p = new URLSearchParams(searchParams)
          if (t) p.set('tag', t)
          else p.delete('tag')
          setSearchParams(p)
        }}
        onPortChange={(p) => {
          const sp = new URLSearchParams(searchParams)
          if (p) sp.set('port', p)
          else sp.delete('port')
          setSearchParams(sp)
        }}
        onIwadChange={(w) => {
          const sp = new URLSearchParams(searchParams)
          if (w) sp.set('iwad', w)
          else sp.delete('iwad')
          setSearchParams(sp)
        }}
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
            {tag || port || iwad ? 'No protocols match these filters.' : 'No protocols yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
