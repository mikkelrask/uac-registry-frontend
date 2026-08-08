import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Protocol } from '@/lib/types'
import { Cpu, Monitor, Globe } from 'lucide-react'

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  let parsed: { ports?: string[]; iwads?: string[]; mods?: unknown[] } = {}
  try {
    parsed = JSON.parse(protocol.protocol_json)
  } catch { /* ignore */ }

  const modCount = parsed.mods?.length ?? 0
  const ports = parsed.ports?.slice(0, 4) ?? []
  const iwads = parsed.iwads?.slice(0, 4) ?? []

  return (
    <Link to={`/protocols/${protocol.slug}`} className="block group">
      <Card className="h-full hover:translate-y-[-2px] transition-transform">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate group-hover:text-accent-highlight transition-colors">
                {protocol.title}
              </CardTitle>
              {protocol.author && (
                <CardDescription className="text-xs mt-0.5">by {protocol.author}</CardDescription>
              )}
            </div>
            <Cpu className="size-5 text-muted-foreground shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {modCount > 0 && (
            <span className="text-xs text-muted-foreground">{modCount} mod{modCount !== 1 ? 's' : ''}</span>
          )}
          <div className="flex flex-wrap gap-1">
            {ports.map((p: string) => (
              <Badge key={p} variant="secondary" className="text-[10px] gap-1">
                <Monitor className="size-2.5" />
                {p}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {iwads.map((w: string) => (
              <Badge key={w} variant="secondary" className="text-[10px] gap-1">
                <Globe className="size-2.5" />
                {w}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(protocol.created_at)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
