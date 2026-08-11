import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFamilies, useProtocols, useCategories } from '@/hooks/useRegistryAPI'
import { ModCard } from '@/components/ModCard'
import { ProtocolCard } from '@/components/ProtocolCard'
import { Markdown } from '@/components/Markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Cpu, ChevronLeft, ChevronRight, Download, Monitor } from 'lucide-react'
import { isEmbedded } from '@/lib/api'
import type { ModFamily, Protocol } from '@/lib/types'

function isProtocolSlide(slide: Protocol | ModFamily): slide is Protocol {
  return 'title' in slide
}

export function HomePage() {
  const { data: families, isLoading: loadingFamilies } = useFamilies({ limit: '12' })
  const { data: protocols, isLoading: loadingProtocols } = useProtocols()
  const { data: categories } = useCategories()
  // Featured-flagged protocols drive the hero carousel
  const { data: featuredProtocols, isLoading: loadingFeatured } = useProtocols({ featured: '1' })
  // Bigger pool so the category rails cover the catalog, not just the hero's 12
  const { data: browseFamilies } = useFamilies({ limit: '100' })
  const embedded = isEmbedded()

  // Hero slides: featured protocols first; fall back to the latest protocol (or
  // family) so the hero still renders before anything is flagged featured.
  const featuredSettled = !loadingFeatured
  const heroSlides = featuredProtocols?.length
    ? featuredProtocols
    : featuredSettled && protocols?.length
      ? [protocols[0]]
      : featuredSettled && families?.length
        ? [families[0]]
        : null
  const [heroIndex, setHeroIndex] = useState(0)
  const heroCount = heroSlides?.length ?? 0
  const safeIndex = heroCount > 0 ? Math.min(heroIndex, heroCount - 1) : 0
  const heroSlide = heroSlides?.[safeIndex] ?? null
  const heroPrev = () => setHeroIndex((i) => (i - 1 + heroCount) % heroCount)
  const heroNext = () => setHeroIndex((i) => (i + 1) % heroCount)

  // Featured item fallback: first family if no protocols exist at all
  const featuredFamily = families?.length ? families[0] : null

  // Rest of families for the grid (exclude the featured one)
  const gridFamilies = families?.filter((f) => f.id !== featuredFamily?.id).slice(0, 8) ?? []

  // Group the browse pool by category (uncategorized last)
  const groupedFamilies = useMemo(() => {
    const groups = new Map<string, ModFamily[]>()
    for (const f of browseFamilies ?? []) {
      const key = f.category && f.category !== 'None' && f.category !== 'null' ? f.category : 'Uncategorized'
      groups.set(key, [...(groups.get(key) ?? []), f])
    }
    return [...groups.entries()].sort((a, b) => {
      if (a[0] === 'Uncategorized') return 1
      if (b[0] === 'Uncategorized') return -1
      return b[1].length - a[1].length || a[0].localeCompare(b[0])
    })
  }, [browseFamilies])

  const heroThumb = heroSlide?.thumbnail_url && heroSlide.thumbnail_url !== 'None' ? heroSlide.thumbnail_url : null

  return (
    <div className="space-y-0">
      {/* ── Featured Hero carousel ── */}
      {heroSlides && heroSlide ? (
        <section
          className="hero-container px-4 py-12 sm:py-16"
          tabIndex={heroCount > 1 ? 0 : undefined}
          onKeyDown={(e) => {
            if (heroCount <= 1) return
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              heroPrev()
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              heroNext()
            }
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
            {/* Hero artwork */}
            <div className="w-full lg:w-2/5 aspect-video lg:aspect-[4/3] relative overflow-hidden border border-border bg-card">
              {heroThumb ? (
                <img
                  src={heroThumb}
                  alt={isProtocolSlide(heroSlide) ? heroSlide.title : heroSlide.name}
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
              {isProtocolSlide(heroSlide) ? (
                <HeroProtocolText protocol={heroSlide} />
              ) : (
                <HeroFamilyText family={heroSlide} />
              )}
            </div>
          </div>

          {/* Carousel controls */}
          {heroCount > 1 && (
            <div className="max-w-7xl mx-auto mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className="hero-dot"
                    data-active={i === safeIndex}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === safeIndex}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={heroPrev} className="hero-arrow" aria-label="Previous featured protocol">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={heroNext} className="hero-arrow" aria-label="Next featured protocol">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Empty state when no hero (embedded or no data) */}
      {!heroSlides && !embedded && (
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

        {/* ── Browse by Category — chips + grouped rails ── */}
        {families && families.length > 0 && (
          <>
            <div className="storefront-divider" />
            <section>
              <div className="storefront-section-title">
                <Package className="size-5 text-accent-highlight" />
                Browse by Category
              </div>

              {/* Category chips — jump straight into the filtered /mods page */}
              {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/mods?category=${encodeURIComponent(cat)}`}
                      className="text-xs font-sans uppercase tracking-wider px-3 py-1.5 border border-border text-muted-foreground hover:border-accent-highlight/50 hover:text-foreground transition-colors"
                    >
                      {cat.replace(/_/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}

              {/* One rail per category, biggest first */}
              {groupedFamilies.map(([cat, fams]) => (
                <div key={cat} className="mb-6">
                  <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    {cat.replace(/_/g, ' ')}
                    <span className="text-[10px] text-muted-foreground/60">({fams.length})</span>
                  </h3>
                  <div className="category-rail gap-3">
                    {fams.map((fam) => (
                      <FamilyTile key={fam.id} fam={fam} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function HeroProtocolText({ protocol }: { protocol: Protocol }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-accent-highlight border border-accent-highlight/30 px-2 py-0.5 bg-accent-highlight/5">
          Featured Protocol
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans tracking-wide text-foreground">
        {protocol.title}
      </h1>
      {protocol.description ? (
        <Markdown className="max-w-lg">{protocol.description}</Markdown>
      ) : (
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          A curated launch protocol for UAC Launch Control.
        </p>
      )}
      <div className="flex items-center gap-3 pt-2">
        <Link to={`/protocols/${protocol.slug}`} className="hero-cta">
          <Download className="size-4" />
          View Protocol
        </Link>
        <Link to="/protocols" className="hero-cta-secondary">
          Browse All
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </>
  )
}

function HeroFamilyText({ family }: { family: ModFamily }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-accent-highlight border border-accent-highlight/30 px-2 py-0.5 bg-accent-highlight/5">
          Featured Mod
        </span>
        {family.category && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {family.category}
          </span>
        )}
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans tracking-wide text-foreground">
        {family.name}
      </h1>
      {family.description ? (
        <Markdown className="max-w-lg">{family.description}</Markdown>
      ) : (
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          A community mod for UAC Launch Control.
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {family.author && <span>by {family.author}</span>}
        <span>·</span>
        <span className="flex items-center gap-1">
          <Package className="size-3" />
          {family.mod_count ?? 0} mod{(family.mod_count ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link to={`/mods/${family.id}`} className="hero-cta">
          <Download className="size-4" />
          View Details
        </Link>
        <Link to="/mods" className="hero-cta-secondary">
          Browse All
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </>
  )
}

function FamilyTile({ fam }: { fam: ModFamily }) {
  return (
    <Link
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
  )
}
