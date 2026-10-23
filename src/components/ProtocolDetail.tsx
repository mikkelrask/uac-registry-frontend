import { useParams, Link } from 'react-router-dom'
import { Monitor, Globe, Tag, User, Calendar, Download, Package } from 'lucide-react'
import { useProtocolDetail } from '@/hooks/useRegistryAPI'
import { BackButton } from '@/components/BackButton'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { installProtocol } from '@/lib/api'
import type { ProtocolMod } from '@/lib/types'

export function ProtocolDetailComponent() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error } = useProtocolDetail(slug ?? '')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="py-16 border border-border bg-card/30">
          <p className="text-muted-foreground">Protocol not found.</p>
          <BackButton variant="inline" fallback="/protocols">Back to protocols</BackButton>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <BackButton fallback="/protocols">Back to protocols</BackButton>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl tracking-wide flex items-center gap-3">
            <span className="inline-block w-1 h-[1.1em] bg-accent-highlight rounded-sm" />
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-3 mt-3 items-center">
            {data.author && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="size-3.5" />
                {data.author}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              {formatDate(data.created_at)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Package className="size-3.5" />
              {data.mods.length} mod{data.mods.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Download className="size-3.5" />
              {data.download_count} downloads
            </span>
          </div>
        </div>
        <button
          onClick={() => void installProtocol(data.protocol_json, data.slug)}
          className="hero-cta shrink-0"
        >
          <Download className="size-4" />
          Install Protocol
        </button>
      </div>

      {data.thumbnail_url && data.thumbnail_url !== 'None' && (
        <img
          src={data.thumbnail_url}
          alt={data.title}
          className="w-full aspect-video object-cover border border-border"
        />
      )}

      {data.description && (
        <Markdown className="max-w-prose">{data.description}</Markdown>
      )}

      {data.youtube_video_id && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${data.youtube_video_id}`}
          title="Protocol video"
          allowFullScreen
          className="w-3/4 mx-auto aspect-video border border-border bg-black"
        />
      )}

      {/* Ports & IWADs */}
      <div className="flex flex-wrap gap-4">
        {data.iwads.length > 0 && (
          <div>
            <h3 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Globe className="size-3.5" />
              Supported IWADs
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.iwads.map((w) => (
                <Badge key={w.id} variant={w.is_required ? 'default' : 'secondary'} className="text-[10px]">
                  {w.iwad}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {data.ports.length > 0 && (
          <div>
            <h3 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Monitor className="size-3.5" />
              Supported Source Ports
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.ports.map((p) => (
                <Badge key={p.id} variant={p.is_required ? 'default' : 'secondary'} className="text-[10px]">
                  {p.source_port}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.tags.length > 0 && (
        <div>
          <h3 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Tag className="size-3.5" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((t) => (
              <Badge key={t.id} variant="outline" className="text-[10px]">
                {t.tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <h2 className="storefront-section-title mb-4">
          Mods ({data.mods.length})
        </h2>
        {data.mods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No mods in this protocol.</p>
        ) : (
          <div className="space-y-2">
            {data.mods.map((mod: ProtocolMod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between gap-3 p-3 border border-border bg-card/50 hover:border-accent-highlight/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                    {mod.family_id ? (
                      <Link
                        to={`/mods/${mod.family_id}`}
                        className="font-sans text-sm hover:text-accent-highlight transition-colors"
                      >
                        {mod.display_name}
                      </Link>
                    ) : (
                      <span className="font-sans text-sm">{mod.display_name}</span>
                    )}
                    {mod.version && (
                      <span className="text-xs text-foreground font-semibold">v{mod.version}</span>
                    )}
                    {mod.author && (
                      <span className="text-[10px] text-muted-foreground">by {mod.author}</span>
                    )}
                    {mod.mod_hash && (
                      <code className="text-[10px] text-muted-foreground/60 ml-auto font-mono">
                        #{mod.mod_hash.slice(0, 8)}
                      </code>
                    )}
                  </div>
                </div>
                <a
                  href={mod.mod_hash ? `${import.meta.env.VITE_API_BASE ?? 'https://db.uac-soft.online'}/api/downloads/mods/${mod.mod_hash}?url=${encodeURIComponent(mod.download_url)}` : mod.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent-highlight hover:underline flex items-center gap-1 shrink-0"
                >
                  <Download className="size-3" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
