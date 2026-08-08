import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Monitor, Globe, Tag, User, Calendar, Download, Package } from 'lucide-react'
import { useProtocolDetail } from '@/hooks/useRegistryAPI'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Protocol not found.</p>
        <Link to="/protocols" className="text-accent-highlight hover:underline text-sm mt-2 inline-block">
          &larr; Back to protocols
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/protocols" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" />
        Back to protocols
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans tracking-wide">{data.title}</h1>
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
          </div>
        </div>
        <Button
          variant="uac"
          size="lg"
          onClick={() => installProtocol(data.protocol_json)}
          className="shrink-0"
        >
          <Download className="size-4" />
          Install Protocol
        </Button>
      </div>

      {data.thumbnail_url && (
        <img
          src={data.thumbnail_url}
          alt={data.title}
          className="w-full max-h-64 object-cover border border-border"
        />
      )}

      {data.description && (
        <p className="text-sm text-muted-foreground max-w-prose">{data.description}</p>
      )}

      {/* Ports & IWADs */}
      <div className="flex flex-wrap gap-4">
        {data.iwads.length > 0 && (
          <div>
            <h3 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Globe className="size-3.5" />
              IWADs
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.iwads.map((w) => (
                <Badge key={w.id} variant={w.is_required ? 'default' : 'secondary'} className="text-[10px]">
                  {w.iwad}
                  {w.is_required ? '' : ' (optional)'}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {data.ports.length > 0 && (
          <div>
            <h3 className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Monitor className="size-3.5" />
              Source Ports
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.ports.map((p) => (
                <Badge key={p.id} variant={p.is_required ? 'default' : 'secondary'} className="text-[10px]">
                  {p.source_port}
                  {p.is_required ? '' : ' (optional)'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
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

      {/* Mods list */}
      <div>
        <h2 className="font-sans text-lg tracking-wide mb-4">
          Mods ({data.mods.length})
        </h2>
        {data.mods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No mods in this protocol.</p>
        ) : (
          <div className="space-y-2">
            {data.mods.map((mod: ProtocolMod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between p-3 border border-border bg-card/50"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-sans text-sm">{mod.display_name}</span>
                  {mod.mod_hash && (
                    <code className="text-[10px] text-muted-foreground ml-2">{mod.mod_hash.slice(0, 8)}</code>
                  )}
                </div>
                <a
                  href={mod.download_url}
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
