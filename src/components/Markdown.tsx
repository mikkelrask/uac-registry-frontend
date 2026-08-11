import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { cn } from '@/lib/utils'

const components: Components = {
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-highlight hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  h1: ({ children }) => (
    <h1 className="font-sans text-lg tracking-wide text-foreground mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-sans text-base tracking-wide text-foreground mt-4 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-sans text-sm tracking-wide text-foreground mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-sans text-xs uppercase tracking-wider text-foreground mt-3 mb-1 first:mt-0">
      {children}
    </h4>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 first:mt-0 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 first:mt-0 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children }) => (
    <code className="bg-muted/60 border border-border px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-card border border-border p-3 overflow-x-auto font-mono text-xs my-2 first:mt-0 last:mb-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent-highlight/50 pl-3 text-muted-foreground/80 italic my-2 first:mt-0 last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
}

/**
 * Renders markdown-authored description text (from mod families and protocols)
 * in the UAC storefront theme. Raw HTML is escaped by react-markdown by
 * default, so arbitrary HTML in descriptions can't inject scripts.
 */
export function Markdown({ children, className }: { children?: string | null; className?: string }) {
  return (
    <div className={cn('text-sm text-muted-foreground leading-relaxed', className)}>
      <ReactMarkdown components={components}>{children ?? ''}</ReactMarkdown>
    </div>
  )
}
