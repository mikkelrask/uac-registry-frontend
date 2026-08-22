import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Calendar, User, Globe as GlobeIcon } from 'lucide-react'
import { useFamilyDetail } from '@/hooks/useRegistryAPI'
import { CategoryBadge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'
import { ScreenshotGallery } from '@/components/ScreenshotGallery'
import { formatDate } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function ModFamilyDetail() {
  const { familyName } = useParams<{ familyName: string }>()
  const { data, isLoading, error } = useFamilyDetail(familyName ?? '')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="py-16 border border-border bg-card/30">
          <p className="text-muted-foreground">Family not found.</p>
          <Link to="/mods" className="text-accent-highlight hover:underline text-sm mt-2 inline-block">
            &larr; Back to mods
          </Link>
        </div>
      </div>
    )
  }

  const family = data
  const mods = data.versions

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Link to="/mods" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans tracking-wide">
        <ArrowLeft className="size-3.5" />
        Back to mods
      </Link>

      <div>
        <h1 className="font-sans text-2xl tracking-wide flex items-center gap-3">
          <span className="inline-block w-1 h-[1.1em] bg-accent-highlight rounded-sm" />
          {family.name}
        </h1>
        <div className="flex flex-wrap gap-3 mt-3 items-center">
          {family.category && <CategoryBadge category={family.category} />}
          {family.author && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="size-3.5" />
              {family.author}
            </span>
          )}
          {family.website && (
            <a
              href={family.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-accent-highlight hover:underline"
            >
              <GlobeIcon className="size-3.5" />
              Website
              <ExternalLink className="size-3" />
            </a>
          )}
          {family.created_at && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              {formatDate(family.created_at)}
            </span>
          )}
        </div>
      </div>

      {family.thumbnail_url && family.thumbnail_url !== 'None' && (
        <img
          src={family.thumbnail_url}
          alt={family.name}
          className="w-full aspect-video object-cover border border-border"
        />
      )}

      {family.description && <Markdown>{family.description}</Markdown>}

      {family.screenshots?.length ? <ScreenshotGallery screenshots={family.screenshots} /> : null}

      <Separator />

      <div>
        <h2 className="storefront-section-title mb-4">
          Versions ({mods.length})
        </h2>
        {mods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No versions registered yet.</p>
        ) : (
          <div className="space-y-2">
            {mods.map((mod) => (
              <div
                key={mod.hash}
                className="flex items-center justify-between p-3 border border-border bg-card/50 hover:border-accent-highlight/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-sm">{mod.display_name}</span>
                    {mod.version && (
                      <span className="text-xs text-muted-foreground">v{mod.version}</span>
                    )}
                    {mod.category && <CategoryBadge category={mod.category} />}
                  </div>
                  {mod.approved_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {formatDate(mod.approved_at)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {mod.urls?.map((u) => (
                    <a
                      key={u.url}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-highlight hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="size-3" />
                      {u.domain}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
