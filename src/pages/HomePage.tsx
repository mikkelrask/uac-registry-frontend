import { Link } from 'react-router-dom'
import { SearchBar } from '@/components/SearchBar'
import { useFamilies, useProtocols } from '@/hooks/useRegistryAPI'
import { ProtocolCard } from '@/components/ProtocolCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Cpu, ChevronRight } from 'lucide-react'
import { isEmbedded } from '@/lib/api'

export function HomePage() {
  const { data: families, isLoading: loadingFamilies } = useFamilies({ limit: '6' })
  const { data: protocols, isLoading: loadingProtocols } = useProtocols()
  const embedded = isEmbedded()

  return (
    <div className="space-y-10">
      {/* Hero — hidden when embedded in the Electron app */}
      {!embedded && (
        <section className="text-center py-8">
          <h1 className="text-3xl sm:text-4xl font-sans tracking-widest uppercase text-accent-highlight">
            UAC Registry
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
            Community-curated mods and launch protocols for UAC Launch Control.
            Browse, discover, and install with one click.
          </p>
          <div className="mt-6 flex justify-center">
            <SearchBar />
          </div>
        </section>
      )}

      {/* Latest Mods */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-lg tracking-wide flex items-center gap-2">
            <Package className="size-5 text-accent-highlight" />
            Latest Mods
          </h2>
          <Link to="/mods" className="text-sm text-accent-highlight hover:underline flex items-center gap-1">
            View all <ChevronRight className="size-3.5" />
          </Link>
        </div>
        {loadingFamilies ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : families?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {families.slice(0, 6).map((fam) => (
              <Link key={fam.id} to={`/mods/${fam.id}`} className="block group">
                <div className="border border-border bg-card/50 p-4 hover:border-accent-highlight/35 hover:translate-y-[-2px] transition-all">
                  <h3 className="font-sans text-sm group-hover:text-accent-highlight transition-colors truncate">
                    {fam.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fam.mod_count ?? 0} mod{(fam.mod_count ?? 0) !== 1 ? 's' : ''}
                    {fam.category && ` · ${fam.category}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No mods yet. Be the first to submit one through UAC Launch Control!
          </p>
        )}
      </section>

      {/* Protocols */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-lg tracking-wide flex items-center gap-2">
            <Cpu className="size-5 text-accent-highlight" />
            Featured Protocols
          </h2>
          <Link to="/protocols" className="text-sm text-accent-highlight hover:underline flex items-center gap-1">
            View all <ChevronRight className="size-3.5" />
          </Link>
        </div>
        {loadingProtocols ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : protocols?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.slice(0, 3).map((p) => (
              <ProtocolCard key={p.id} protocol={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No protocols yet.</p>
        )}
      </section>
    </div>
  )
}
