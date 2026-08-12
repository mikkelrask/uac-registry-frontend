import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  /** 1-based current page */
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

/** Up to 5 numbered buttons, windowed around the current page. */
function pageWindow(page: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  const pages: number[] = []
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
}

export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions = [12, 24, 48, 96],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const pages = pageWindow(safePage, totalPages)

  const navClass = 'w-9 px-0'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
      <p className="text-sm text-muted-foreground">
        Page {safePage} of {totalPages} · {total} total
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className={navClass}
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === safePage ? 'default' : 'outline'}
            className={navClass}
            disabled={p === safePage}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === safePage ? 'page' : undefined}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className={navClass}
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
        <label className="ml-3 flex items-center gap-2 text-sm text-muted-foreground">
          Per page
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
