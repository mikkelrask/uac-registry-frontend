import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Package, Cpu, Home, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isEmbedded } from '@/lib/api'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/', label: 'Store', icon: Home },
  { to: '/mods', label: 'Mods', icon: Package },
  { to: '/protocols', label: 'Protocols', icon: Cpu },
]

export function UacLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const embedded = isEmbedded()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // ── Embedded mode: functional but zero site-level chrome ──
  if (embedded) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        {/* In-content toolbar: search + breadcrumb — no wordmark, no site nav, no footer */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-card border border-border px-2.5 py-1.5 focus-within:border-accent-highlight/50 transition-colors max-w-sm">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="search"
              placeholder="Search mods & protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
            />
          </form>

          {/* Quick nav links for browsing — in-content, not site header */}
          <nav className="hidden sm:flex items-center gap-1 text-xs">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 px-3 py-3">
          {children}
        </main>
      </div>
    )
  }

  // ── Standalone storefront chrome ──
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Storefront header */}
      <header className="storefront-header">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex items-center gap-1.5">
              <Monitor className="size-5 text-accent-highlight group-hover:text-accent-highlight/80 transition-colors" />
              <span className="text-base font-sans tracking-[0.25em] uppercase text-foreground">
                UAC
              </span>
            </div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hidden sm:inline">
              Registry
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans tracking-wide transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="storefront-search hidden md:flex">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="search"
              placeholder="Search mods & protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground space-y-2">
        <p>
          <span className="tracking-[0.25em] uppercase text-accent-highlight">UAC</span>{' '}
          Registry &mdash; Community mods &amp; protocols for UAC Launch Control
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} UAC Registry. All mods and protocols are property of their respective authors.
        </p>
      </footer>
    </div>
  )
}
