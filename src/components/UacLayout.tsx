import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isEmbedded } from '@/lib/api'
import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const NAV_ITEMS = [
  { to: '/', label: 'Store' },
  { to: '/mods', label: 'Mods' },
  { to: '/protocols', label: 'Protocols' },
]

// Hamburger drawer with the site nav — replaces the inline nav on small
// screens. triggerClassName controls at which breakpoint it appears
// (differs between the slim embedded toolbar and the standalone header).
function MobileNav({ triggerClassName }: { triggerClassName: string }) {
  const location = useLocation()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center size-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors',
            triggerClassName
          )}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader className="mb-2">
          <SheetTitle>Navigate</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <SheetClose asChild key={to}>
              <Link
                to={to}
                className={cn(
                  'px-3 py-2.5 text-sm font-sans tracking-wide transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight bg-accent-highlight/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                {label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

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
  // No branding here — the host app (UAC Launch Control) provides its own.
  // Search lives on the home page itself, not in this toolbar.
  if (embedded) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        {/* In-content toolbar: nav only — no wordmark, no search, no footer */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center justify-between gap-3">
          <nav className="hidden sm:flex items-center gap-1 text-xs">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'px-2 py-1 transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <MobileNav triggerClassName="sm:hidden" />
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
          {/* Brand: app icon + wordmark */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src="/app-icon.png"
              alt="UAC Launch Control"
              className="size-6 group-hover:opacity-80 transition-opacity"
            />
            <span className="text-base font-sans tracking-[0.25em] uppercase text-foreground">
              UAC
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hidden sm:inline">
              Registry
            </span>
          </Link>

          {/* Nav — text only */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'px-3 py-1.5 text-sm font-sans tracking-wide transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="storefront-search hidden md:flex">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="search"
                placeholder="Search mods & protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <MobileNav triggerClassName="md:hidden" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground space-y-2">
        <p>
          <span className="tracking-[0.25em] uppercase text-accent-highlight">UAC</span>{' '}
          Registry &mdash; Community mods &amp; protocols for{' '}
          <a
            href="https://uac-soft.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-highlight hover:underline"
          >
            UAC Launch Control
          </a>
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} UAC Registry. All mods and protocols are property of their respective authors.
        </p>
      </footer>
    </div>
  )
}
