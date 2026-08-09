import { useSearchParams } from 'react-router-dom'
import { useSearch } from '@/hooks/useRegistryAPI'
import { ModCardCompat } from '@/components/ModCard'
import { ProtocolCard } from '@/components/ProtocolCard'
import { SearchBar } from '@/components/SearchBar'
import { Loader2 } from 'lucide-react'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data, isLoading } = useSearch(query)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-sans text-lg tracking-widest uppercase flex items-center gap-3">
        <span className="inline-block w-1 h-[1.1em] bg-accent-highlight rounded-sm" />
        Search
      </h1>
      <SearchBar />

      {query && isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!query && (
        <div className="text-center py-16 border border-border bg-card/30">
          <p className="text-sm text-muted-foreground">
            Enter a search term to find mods and protocols.
          </p>
        </div>
      )}

      {data && data.length === 0 && query && !isLoading && (
        <div className="text-center py-16 border border-border bg-card/30">
          <p className="text-sm text-muted-foreground">
            No results for &ldquo;{query}&rdquo;.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((result, i) => {
            if (result.type === 'mod' && result.mod) {
              return <ModCardCompat key={`mod-${i}`} mod={result.mod} />
            }
            if (result.type === 'protocol' && result.protocol) {
              return <ProtocolCard key={`protocol-${i}`} protocol={result.protocol} />
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
