import { Link } from 'react-router-dom'
import { Calendar, Download, ExternalLink, Globe, Package, Layers } from 'lucide-react'
import { useModDetail } from '@/hooks/useRegistryAPI'
import { BackButton } from '@/components/BackButton'
import { CategoryBadge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

export function ModFileDetail({ hash }: { hash: string }) {
  const { data, isLoading, error } = useModDetail(hash)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="py-16 border border-border bg-card/30">
          <p className="text-muted-foreground">Mod file not found.</p>
          <BackButton variant="inline" fallback="/mods">Back to mods</BackButton>
        </div>
      </div>
    )
  }

  const loadOrderEntries = Object.entries(data.load_order ?? {})

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <BackButton fallback="/mods">Back to mods</BackButton>

      <div>
        <h1 className="font-sans text-2xl tracking-wide flex items-center gap-3">
          <span className="inline-block w-1 h-[1.1em] bg-accent-highlight rounded-sm" />
          {data.display_name || data.family_name}
        </h1>
        <div className="flex flex-wrap gap-3 mt-3 items-center">
          {data.category && <CategoryBadge category={data.category} />}
          <Link
            to={`/mods/${data.family_id}`}
            className="flex items-center gap-1 text-sm text-accent-highlight hover:underline"
          >
            <Package className="size-3.5" />
            {data.family_name}
          </Link>
          {data.version && (
            <span className="flex items-center gap-1 text-sm text-foreground font-semibold">
              v{data.version}
            </span>
          )}
          {data.is_sidecar === 1 && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-muted/50 border border-border text-muted-foreground">
              Sidecar
            </span>
          )}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-3.5" />
            Added {formatDate(data.approved_at)}
          </span>
        </div>
      </div>

      <div className="border border-border bg-card/30 p-4 space-y-3">
        <div>
          <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">MD5</span>
          <code className="block mt-1 font-mono text-xs text-foreground break-all">{hash}</code>
        </div>
        {loadOrderEntries.length > 0 && (
          <div>
            <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Layers className="size-3" />
              Load Order
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {loadOrderEntries.map(([file, order]) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 border border-border text-xs font-mono"
                >
                  {order}
                  <span className="text-muted-foreground/60">{file}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        {data.urls.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {data.urls.map((u) => (
              <a
                key={u.url}
                href={u.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta"
              >
                <Download className="size-4" />
                {u.domain || 'Download'}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No download URL registered for this mod file.</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Globe className="size-3" />
        Part of the {data.family_name} family — view the family for screenshots and other versions.
      </p>
    </div>
  )
}
