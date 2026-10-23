import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/Markdown'
import type { ModFamily } from '@/lib/types'
import { Download, Package } from 'lucide-react'

const CATEGORY_PLACEHOLDER_CLASSES: Record<string, string> = {
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

function getPlaceholderClass(category: string | null | undefined): string {
  if (!category) return 'tile-placeholder-utilities'
  return CATEGORY_PLACEHOLDER_CLASSES[category.toLowerCase()] ?? 'tile-placeholder-utilities'
}

export function ModCard({ mod, showDownloads = false }: { mod: ModFamily; showDownloads?: boolean }) {
  const hasThumb = mod.thumbnail_url && mod.thumbnail_url !== 'None' && mod.thumbnail_url !== 'null'
  const placeholderClass = getPlaceholderClass(mod.category)
  const name = mod.name

  return (
    <Link
      to={`/mods/${mod.id}`}
      className="mod-grid-tile block group"
    >
      {/* Thumbnail or placeholder */}
      {hasThumb ? (
        <img
          src={mod.thumbnail_url!}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={cn('absolute inset-0 tile-placeholder', placeholderClass)}>
          <span className="opacity-20">{name.slice(0, 3).toUpperCase()}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="tile-overlay">
        {/* Category badge */}
        {mod.category && (
          <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-black/60 text-accent-highlight border border-accent-highlight/30">
            {mod.category}
          </span>
        )}

        {/* Title */}
        <div className="space-y-1">
          <h3 className="font-sans text-sm tracking-wide text-foreground truncate">
            {name}
          </h3>
          {mod.description ? (
            <Markdown className="text-[11px] line-clamp-2 leading-tight">{mod.description}</Markdown>
          ) : (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
              No description
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {showDownloads ? <Download className="size-3" /> : <Package className="size-3" />}
              {showDownloads ? `${mod.download_count ?? 0} downloads` : (mod.mod_count ?? 0)}
            </span>
            {mod.author && (
              <span className="text-[11px] text-muted-foreground truncate">
                {mod.author}
              </span>
            )}
          </div>

          {/* Hover actions */}
          <div className="tile-actions mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-sans tracking-wide text-accent-highlight bg-black/60 px-2.5 py-1 border border-accent-highlight/30 hover:border-accent-highlight/60 transition-colors">
              <Download className="size-3" />
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
