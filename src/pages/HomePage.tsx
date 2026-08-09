import { Link } from 'react-router-dom'
import { useFamilies, useProtocols } from '@/hooks/useRegistryAPI'
import { ModCard } from '@/components/ModCard'
import { ProtocolCard } from '@/components/ProtocolCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Cpu, ChevronRight, Download, Monitor } from 'lucide-react'
import { isEmbedded } from '@/lib/api'

export function HomePage() {
  const { data: families, isLoading: loadingFamilies } = useFamilies({ limit: '12' })
  const { data: protocols, isLoading: loadingProtocols } = useProtocols()
  const embedded = isEmbedded()

  // Featured item: first protocol if available, otherwise first family
  const featuredProtocol = protocols?.length ? protocols[0] : null
  const featuredFamily = families?.length ? families[0] : null
  const hasFeatured = !!(featuredProtocol || featuredFamily)

  // Rest of families for the grid (exclude the featured one)
  const gridFamilies = families?.filter((f) => f.id !== featuredFamily?.id).slice(0, 8) ?? []

  return (
    <div className="space-y-0">
      {/* ── Featured Hero ── */}
      {!embedded && hasFeatured && (
        <section className="hero-container px-4 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
            {/* Hero artwork */}
            <div className="w-full lg:w-2/5 aspect-video lg:aspect-[4/3] relative overflow-hidden border border-border bg-card">
              {featuredProtocol?.thumbnail_url && featuredProtocol.thumbnail_url !== 'None' ? (
                <img
                  src={featuredProtocol.thumbnail_url}
                  alt={featuredProtocol.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : featuredFamily?.thumbnail_url && featuredFamily.thumbnail_url !== 'None' ? (
                <img
                  src={featuredFamily.thumbnail_url}
                  alt={featuredFamily.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-hsl(var(--uac-maroon)) to-hsl(var(--background))">
                  <Monitor className="size-16 text-accent-highlight/30 mb-3" />
                  <span className="text-sm font-sans tracking-[0.3em] uppercase text-muted-foreground/40">
                    UAC Registry
                  </span>
                </div>
              )}
              {/* Gradient fade on left side */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Hero text */}
            <div className="w-full lg:w-3/5 space-y-4">
              {featuredProtocol ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent-highlight border border-accent-highlight/30 px-2 py-0.5 bg-accent-highlight/5">
                      Featured Protocol
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans tracking-wide text-foreground">
                    {featuredProtocol.title}
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                    {featuredProtocol.description || 'A curated launch protocol for UAC Launch Control.'}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link to={`/protocols/${featuredProtocol.slug}`} className="hero-cta">
                      <Download className="size-4" />
                      View Protocol
                    </Link>
                    <Link to="/protocols" className="hero-cta-secondary">
                      Browse All
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </>
              ) : featuredFamily ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent-highlight border border-accent-highlight/30 px-2 py-0.5 bg-accent-highlight/5">
                      Featured Mod
                    </span>
                    {featuredFamily.category && (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {featuredFamily.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans tracking-wide text-foreground">
                    {featuredFamily.name}
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                    {featuredFamily.description || 'A community mod for UAC Launch Control.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {featuredFamily.author && <span>by {featuredFamily.author}</span>}
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Package className="size-3" />
                      {featuredFamily.mod_count ?? 0} mod{(featuredFamily.mod_count ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Link to={`/mods/${featuredFamily.id}`} className="hero-cta">
                      <Download className="size-4" />
                      View Details
                    </Link>
                    <Link to="/mods" className="hero-cta-secondary">
                      Browse All
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Empty state when no hero (embedded or no data) */}
      {!hasFeatured && !embedded && (
        <section className="px-4 py-16 text-center">
          <Monitor className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-sans tracking-[0.25em] uppercase text-foreground">
            UAC Registry
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            No content published yet. Launch protocols and mods will appear here once submitted through UAC Launch Control.
          </p>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* ── Latest Mods — image-first grid ── */}
        <section>
          <div className="storefront-section-title">
            <Package className="size-5 text-accent-highlight" />
            Latest Mods
            <Link
              to="/mods"
              className="ml-auto text-xs text-accent-highlight hover:underline flex items-center gap-1 font-sans tracking-wide"
            >
              View all <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {loadingFamilies ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[16/10]" />
              ))}
            </div>
          ) : gridFamilies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gridFamilies.map((fam) => (
                <ModCard key={fam.id} mod={fam} />
              ))}
            </div>
          ) : families?.length ? null : (
            <div className="border border-border bg-card/30 p-8 text-center">
              <Package className="size-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No mods yet. Be the first to submit one through UAC Launch Control.
              </p>
            </div>
          )}
        </section>

        <div className="storefront-divider" />

        {/* ── Featured Protocols ── */}
        <section>
          <div className="storefront-section-title">
            <Cpu className="size-5 text-accent-highlight" />
            Featured Protocols
            <Link
              to="/protocols"
              className="ml-auto text-xs text-accent-highlight hover:underline flex items-center gap-1 font-sans tracking-wide"
            >
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
            <div className="border border-border bg-card/30 p-8 text-center">
              <Cpu className="size-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No protocols yet.</p>
            </div>
          )}
        </section>

        {/* ── Category rails — show all families grouped by category ── */}
        {families && families.length > 0 && (
          <>
            <div className="storefront-divider" />
            <section>
              <div className="storefront-section-title">
                <Package className="size-5 text-accent-highlight" />
                Browse by Category
              </div>
              <div className="category-rail gap-3">
                {families.map((fam) => (
                  <Link
                    key={fam.id}
                    to={`/mods/${fam.id}`}
                    className="mod-grid-tile block group shrink-0"
                    style={{ width: 'clamp(160px, 20vw, 220px)' }}
                  >
                    {fam.thumbnail_url && fam.thumbnail_url !== 'None' && fam.thumbnail_url !== 'null' ? (
                      <img
                        src={fam.thumbnail_url}
                        alt={fam.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`absolute inset-0 tile-placeholder tile-placeholder-${fam.category?.toLowerCase() ?? 'utilities'}`}>
                        <span className="opacity-20">{fam.name.slice(0, 3).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="tile-overlay">
                      <h3 className="font-sans text-sm tracking-wide text-foreground truncate">
                        {fam.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {fam.mod_count ?? 0} mod{(fam.mod_count ?? 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
