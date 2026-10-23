import { useParams } from 'react-router-dom'
import { ExternalLink, Calendar, User, Globe as GlobeIcon, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFamilyDetail } from '@/hooks/useRegistryAPI'
import { BackButton } from '@/components/BackButton'
import { CategoryBadge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'
import { ScreenshotGallery } from '@/components/ScreenshotGallery'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, compareVersionsDesc } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { ModEntry } from '@/lib/types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://db.uac-soft.online'

function trackedDownloadUrl(hash: string, url: string) {
  return `${API_BASE}/api/downloads/mods/${hash}?url=${encodeURIComponent(url)}`
}

function ModFileRow({ mod }: { mod: ModEntry }) {
  const urls = mod.urls ?? []

  return (
    <div className="flex items-center justify-between gap-3 p-3 border border-border bg-card/50 hover:border-accent-highlight/30 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/mods/${mod.hash}`} className="font-sans text-sm text-accent-highlight hover:underline">
            {mod.display_name}
          </Link>
          {mod.category && <CategoryBadge category={mod.category} />}
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Download className="size-3" /> {mod.download_count ?? 0} downloads · View file details
        </p>
        {mod.approved_at && (
          <p className="text-xs text-muted-foreground mt-1">
            Added {formatDate(mod.approved_at)}
          </p>
        )}
      </div>

      {urls.length === 1 ? (
        <a
          href={trackedDownloadUrl(mod.hash, urls[0].url)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-highlight hover:underline flex items-center gap-1 shrink-0"
        >
          <ExternalLink className="size-3" />
          {urls[0].domain}
        </a>
      ) : urls.length > 1 ? (
        <Select
          onValueChange={(url) => window.open(trackedDownloadUrl(mod.hash, url), '_blank', 'noopener,noreferrer')}
        >
          <SelectTrigger className="h-7 w-auto gap-1 px-2 text-xs text-muted-foreground hover:text-foreground border-border bg-card">
            <ExternalLink className="size-3 text-accent-highlight shrink-0" />
            <SelectValue placeholder="Downloads" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover text-popover-foreground">
            {urls.map((u) => (
              <SelectItem key={u.url} value={u.url} className="text-xs">
                {u.domain || u.url}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  )
}

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
          <BackButton variant="inline" fallback="/mods">Back to mods</BackButton>
        </div>
      </div>
    )
  }

  const family = data
  const mods = data.versions

  // Sort files highest version first (natural numeric order: 10.0 > 9.1),
  // not by when they were added to the registry. Equal versions keep the
  // API order (newest approved first); versionless files land last.
  const sortedMods = [...mods].sort((a, b) =>
    compareVersionsDesc(a.version ?? '', b.version ?? ''),
  )

  // Group files by version, preserving the sorted order above.
  // Files without a version land in an "Unversioned" group.
  const versionGroups: Array<[string, ModEntry[]]> = []
  for (const mod of sortedMods) {
    const key = mod.version ?? ''
    const group = versionGroups.find(([k]) => k === key)
    if (group) {
      group[1].push(mod)
    } else {
      versionGroups.push([key, [mod]])
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <BackButton fallback="/mods">Back to mods</BackButton>

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
          Files ({mods.length})
        </h2>
        {mods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files registered yet.</p>
        ) : (
          <div className="space-y-5">
            {versionGroups.map(([version, files]) => (
              <div key={version} className="space-y-2">
                <h3 className="text-sm font-sans tracking-wide text-muted-foreground">
                  {version === '' ? 'Unversioned' : `v${version}`}
                  <span className="text-muted-foreground/60">
                    {' '}· {files.length} file{files.length === 1 ? '' : 's'}
                  </span>
                </h3>
                {files.map((mod) => (
                  <ModFileRow key={mod.hash} mod={mod} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
