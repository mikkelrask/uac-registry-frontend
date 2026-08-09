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

  const { data: mods, isLoading } = useFamilies({ category, limit, offset })
  const { data: categories } = useCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="size-5 text-accent-highlight" />
        <h1 className="text-2xl font-sans tracking-wide">Mods</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : mods?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mods.map((fam) => (
            <ModCard
              key={fam.id}
              mod={{
                hash: fam.id,
                family_name: fam.name,
                family_id: fam.id,
                display_name: fam.name,
                category: fam.category,
                is_sidecar: 0,
                version: null,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12">
          {category ? `No mods found in "${category}".` : 'No mods registered yet.'}
        </p>
      )}
    </div>
  )
}
