import { useSearchParams } from 'react-router-dom'
import { useFamilies, useCategories } from '@/hooks/useRegistryAPI'
import { ModCard } from '@/components/ModCard'
import { FilterPanel } from '@/components/FilterPanel'
import { Pagination } from '@/components/Pagination'
import { Skeleton } from '@/components/ui/skeleton'

const DEFAULT_LIMIT = 24
const PAGE_SIZE_OPTIONS = [12, 24, 48, 96]

export function ModsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const { data, isLoading } = useFamilies({
    category,
    limit: String(limit),
    offset: String(offset),
  })
  const { data: categories } = useCategories()

  const families = data?.families
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const page = Math.floor(offset / limit) + 1

  const updateParams = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams)
    mutate(p)
    setSearchParams(p)
  }

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages)
    updateParams((p) => p.set('offset', String((clamped - 1) * limit)))
  }

  const changePageSize = (size: number) => {
    updateParams((p) => {
      // Keep the first item of the current page in view
      const firstItem = offset
      p.set('limit', String(size))
      p.set('offset', String(Math.floor(firstItem / size) * size))
    })
  }

  const changeCategory = (cat: string | null) => {
    updateParams((p) => {
      if (cat) p.set('category', cat)
      else p.delete('category')
      p.delete('offset')
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="storefront-section-title">
        Mods
      </div>

      {categories && categories.length > 0 && (
        <FilterPanel
          categories={categories}
          activeCategory={category}
          onCategoryChange={changeCategory}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-[16/10]" />
          ))}
        </div>
      ) : families?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {families.map((fam) => (
            <ModCard key={fam.id} mod={fam} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border bg-card/30">
          <img src="/app-icon.png" alt="" className="size-10 opacity-30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {category ? `No mods found in "${category}".` : 'No mods registered yet.'}
          </p>
        </div>
      )}

      {!isLoading && total > 0 && (
        <Pagination
          page={page}
          pageSize={limit}
          total={total}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  )
}
