import { Link, useLocation } from 'react-router-dom'
import { Search, Package, Cpu, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isEmbedded } from '@/lib/api'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/mods', label: 'Mods', icon: Package },
  { to: '/protocols', label: 'Protocols', icon: Cpu },
  { to: '/search', label: 'Search', icon: Search },
]

export function UacLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const embedded = isEmbedded()

  if (embedded) {
    return (
      <main className="min-h-screen bg-background text-foreground font-sans px-3 py-2">
        {children}
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-accent-highlight hover:text-accent-highlight/80 transition-colors">
            <span className="text-lg font-sans tracking-widest uppercase">UAC</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">Registry</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors',
                  location.pathname === to
                    ? 'text-accent-highlight border-b-2 border-accent-highlight'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {children}
      </main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        UAC Registry &mdash; Community mods &amp; protocols for UAC Launch Control
      </footer>
    </div>
  )
}
