import { useSearchParams } from 'react-router-dom'
import { useFamilies, useCategories } from '@/hooks/useRegistryAPI'
import { ModCard } from '@/components/ModCard'
import { FilterPanel } from '@/components/FilterPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'

export function ModsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const limit = searchParams.get('limit') || '24'
  const offset = searchParams.get('offset') || '0'

  const { data: families, isLoading } = useFamilies({ category, limit, offset })
  const { data: categories } = useCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="storefront-section-title">
        <Package className="size-5 text-accent-highlight" />
        Mods
      </div>

      {categories && categories.length > 0 && (
        <FilterPanel
          categories={categories}
          activeCategory={category}
          onCategoryChange={(cat) => {
            const p = new URLSearchParams(searchParams)
            if (cat) p.set('category', cat)
            else p.delete('category')
            p.delete('offset')
            setSearchParams(p)
          }}
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
          <Package className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {category ? `No mods found in "${category}".` : 'No mods registered yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
