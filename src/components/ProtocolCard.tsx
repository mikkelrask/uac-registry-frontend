import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { Protocol } from '@/lib/types'
import { Cpu, Monitor, Globe, Download } from 'lucide-react'

const CATEGORY_TINT: Record<string, string> = {
  gameplay: 'tile-placeholder-gameplay',
  maps: 'tile-placeholder-maps',
  weapons: 'tile-placeholder-weapons',
  monsters: 'tile-placeholder-monsters',
  hud: 'tile-placeholder-hud',
  graphics: 'tile-placeholder-graphics',
  sounds: 'tile-placeholder-sounds',
  music: 'tile-placeholder-music',
  textures: 'tile-placeholder-textures',
  skins: 'tile-placeholder-skins',
  tc: 'tile-placeholder-tc',
  utilities: 'tile-placeholder-utilities',
}

function getPlaceholderClass(title: string): string {
  // Deterministic tint from title so same protocol always gets same color
  const idx = title.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 12
  const keys = Object.keys(CATEGORY_TINT)
  return CATEGORY_TINT[keys[idx]] ?? 'tile-placeholder-utilities'
}

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  let parsed: { ports?: string[]; iwads?: string[]; mods?: unknown[] } = {}
  try {
    parsed = JSON.parse(protocol.protocol_json)
  } catch { /* ignore */ }

  const modCount = parsed.mods?.length ?? 0
  const ports = parsed.ports?.slice(0, 3) ?? []
  const iwads = parsed.iwads?.slice(0, 2) ?? []
  const hasThumb = protocol.thumbnail_url && protocol.thumbnail_url !== 'None' && protocol.thumbnail_url !== 'null'
  const placeholderClass = getPlaceholderClass(protocol.title)
  const title = protocol.title

  return (
    <Link to={`/protocols/${protocol.slug}`} className="mod-grid-tile block group">
      {/* Thumbnail or gradient placeholder */}
      {hasThumb ? (
        <img
          src={protocol.thumbnail_url!}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={cn('absolute inset-0 tile-placeholder', placeholderClass)}>
          <span className="opacity-20">{title.slice(0, 3).toUpperCase()}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="tile-overlay">
        {/* Top-right badges: port + IWAD chips */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {ports.map((p) => (
            <span
              key={p}
              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-black/60 text-accent-highlight border border-accent-highlight/30 flex items-center gap-1"
            >
              <Monitor className="size-2.5" />
              {p}
            </span>
          ))}
          {iwads.map((w) => (
            <span
              key={w}
              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-black/60 text-muted-foreground border border-border/60 flex items-center gap-1"
            >
              <Globe className="size-2.5" />
              {w}
            </span>
          ))}
          {modCount > 0 && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-black/60 text-accent-highlight/70 border border-accent-highlight/20 flex items-center gap-1">
              <Cpu className="size-2.5" />
              {modCount} mod{modCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="space-y-1">
          <h3 className="font-sans text-sm tracking-wide text-foreground truncate">
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
            {protocol.description || 'A curated launch protocol'}
          </p>

          {/* Author row */}
          <div className="flex items-center gap-3 mt-1.5">
            {protocol.author && (
              <span className="text-[11px] text-muted-foreground truncate">
                {protocol.author}
              </span>
            )}
          </div>

          {/* Hover actions */}
          <div className="tile-actions mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-sans tracking-wide text-accent-highlight bg-black/60 px-2.5 py-1 border border-accent-highlight/30 hover:border-accent-highlight/60 transition-colors">
              <Download className="size-3" />
              View Protocol
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
