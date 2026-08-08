import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CategoryBadge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ModEntry } from '@/lib/types'
import { Package, Download, Calendar } from 'lucide-react'

export function ModCard({ mod }: { mod: ModEntry }) {
  const url = mod.url ?? mod.urls?.[0]?.url
  const domain = mod.domain ?? mod.urls?.[0]?.domain

  return (
    <Link to={`/mods/${mod.family_name}`} className="block group">
      <Card className="h-full hover:translate-y-[-2px] transition-transform">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate group-hover:text-accent-highlight transition-colors">
                {mod.display_name}
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {mod.family_name}
                {mod.version && ` · v${mod.version}`}
              </p>
            </div>
            <Package className="size-5 text-muted-foreground shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mod.category && <CategoryBadge category={mod.category} />}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {url && (
              <span className="flex items-center gap-1">
                <Download className="size-3" />
                <span className="truncate max-w-[120px]">{domain || 'download'}</span>
              </span>
            )}
            {mod.approved_at && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(mod.approved_at)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
