import { useSearchParams } from 'react-router-dom'
import { useSearch } from '@/hooks/useRegistryAPI'
import { ModCard } from '@/components/ModCard'
import { ProtocolCard } from '@/components/ProtocolCard'
import { SearchBar } from '@/components/SearchBar'
import { Loader2 } from 'lucide-react'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data, isLoading } = useSearch(query)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-sans tracking-wide">Search</h1>
      <SearchBar />

      {query && isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!query && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Enter a search term to find mods and protocols.
        </p>
      )}

      {data && data.length === 0 && query && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No results for &ldquo;{query}&rdquo;.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((result, i) => {
            if (result.type === 'mod' && result.mod) {
              return <ModCard key={`mod-${i}`} mod={result.mod} />
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
