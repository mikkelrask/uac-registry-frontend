import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center font-sans text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80 px-2 py-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-0.5',
        outline: 'text-foreground border px-2 py-0.5',
        category: 'text-xs px-2 py-0.5 uppercase tracking-wider',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

const CATEGORY_COLORS: Record<string, string> = {
  gameplay: 'bg-green-900/40 text-green-400 border border-green-800/50',
  maps: 'bg-blue-900/40 text-blue-400 border border-blue-800/50',
  weapons: 'bg-red-900/40 text-red-400 border border-red-800/50',
  monsters: 'bg-purple-900/40 text-purple-400 border border-purple-800/50',
  hud: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50',
  graphics: 'bg-pink-900/40 text-pink-400 border border-pink-800/50',
  sounds: 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50',
  music: 'bg-orange-900/40 text-orange-400 border border-orange-800/50',
  textures: 'bg-teal-900/40 text-teal-400 border border-teal-800/50',
  skins: 'bg-indigo-900/40 text-indigo-400 border border-indigo-800/50',
  tc: 'bg-amber-900/40 text-amber-400 border border-amber-800/50',
  utilities: 'bg-slate-700/40 text-slate-300 border border-slate-600/50',
}

export function CategoryBadge({ category }: { category: string | null | undefined }) {
  if (!category) return null
  const colors = CATEGORY_COLORS[category.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border'
  return (
    <span className={cn('text-xs px-2 py-0.5 uppercase tracking-wider', colors)}>
      {category}
    </span>
  )
}
