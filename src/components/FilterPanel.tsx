import { useSearchParams } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'

interface FilterPanelProps {
  categories?: string[]
  tags?: string[]
  ports?: string[]
  iwads?: string[]
  activeCategory?: string
  activeTag?: string
  activePort?: string
  activeIwad?: string
  onCategoryChange?: (cat: string | null) => void
  onTagChange?: (tag: string | null) => void
  onPortChange?: (port: string | null) => void
  onIwadChange?: (iwad: string | null) => void
}

const KNOWN_PORTS = ['gzdoom', 'uzdoom', 'zandronum', 'zdoom', 'lzdoom', 'helion']
const KNOWN_IWADS = ['doom', 'doom2', 'plutonia', 'tnt', 'freedoom1', 'freedoom2', 'freedm']

function FilterSection({
  title,
  items,
  active,
  paramKey,
  handler,
  toggle,
}: {
  title: string
  items: string[]
  active: string | undefined | null
  paramKey: string
  handler?: (v: string | null) => void
  toggle: (key: string, value: string, handler?: (v: string | null) => void) => void
}) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-sans uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <div
            key={item}
            onClick={() => toggle(paramKey, item, handler)}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border hover:border-accent-highlight/50 transition-colors cursor-pointer"
          >
            <Checkbox
              checked={active === item}
              className="size-3 pointer-events-none"
              tabIndex={-1}
            />
            <span className={active === item ? 'text-accent-highlight' : 'text-muted-foreground'}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FilterPanel({
  categories,
  tags,
  ports,
  iwads,
  activeCategory,
  activeTag,
  activePort,
  activeIwad,
  onCategoryChange,
  onTagChange,
  onPortChange,
  onIwadChange,
}: FilterPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const toggle = (key: string, value: string, handler?: (v: string | null) => void) => {
    const current = searchParams.get(key)
    const next = current === value ? null : value
    if (next) {
      searchParams.set(key, next)
    } else {
      searchParams.delete(key)
    }
    setSearchParams(searchParams)
    handler?.(next)
  }

  const cats = categories?.length ? categories : []
  const tgs = tags?.length ? tags : []
  const prts = ports?.length ? ports : KNOWN_PORTS
  const iws = iwads?.length ? iwads : KNOWN_IWADS

  if (!cats.length && !tgs.length && !prts.length && !iws.length && !activeCategory && !activeTag) {
    return null
  }

  return (
    <div className="space-y-4 p-4 border border-border bg-card/50">
      {cats.length > 0 && onCategoryChange && (
        <FilterSection title="Category" items={cats} active={activeCategory} paramKey="category" handler={onCategoryChange} toggle={toggle} />
      )}
      {tgs.length > 0 && onTagChange && (
        <FilterSection title="Tags" items={tgs} active={activeTag} paramKey="tag" handler={onTagChange} toggle={toggle} />
      )}
      {onPortChange && (
        <FilterSection title="Source Port" items={prts} active={activePort} paramKey="port" handler={onPortChange} toggle={toggle} />
      )}
      {onIwadChange && (
        <FilterSection title="IWAD" items={iws} active={activeIwad} paramKey="iwad" handler={onIwadChange} toggle={toggle} />
      )}
    </div>
  )
}
