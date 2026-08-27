import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  /** List route used when there is no history to go back to (e.g. direct load). */
  fallback: string
  /** Visual variant: header arrow button or inline text link (not-found state). */
  variant?: 'header' | 'inline'
  children: React.ReactNode
}

/**
 * Navigates one step back in history instead of a hardcoded list route,
 * since detail pages are reachable from several places (search, category
 * rails, home). Falls back to the list route when there is no history.
 */
export function BackButton({ fallback, variant = 'header', children }: BackButtonProps) {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={goBack}
        className="text-accent-highlight hover:underline text-sm mt-2 inline-block"
      >
        &larr; {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans tracking-wide"
    >
      <ArrowLeft className="size-3.5" />
      {children}
    </button>
  )
}
