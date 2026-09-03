import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(ts: number | null | undefined): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Tokenizes "1.0", "4.12.2", "v2.1b" into numeric and text segments.
const tokenizeVersion = (v: string): Array<number | string> =>
  (v.match(/\d+|[a-zA-Z]+/g) ?? []).map((t) => (/^\d+$/.test(t) ? Number(t) : t.toLowerCase()))

// Compares version strings high-to-low with natural numeric ordering, so
// "10.0" ranks above "9.1" (a plain string compare would invert that).
// Versionless (empty) strings sort below any versioned string; equal
// versions compare 0, leaving the caller's stable order intact.
export function compareVersionsDesc(a: string, b: string): number {
  if (a === b) return 0
  const aEmpty = a.trim().length === 0
  const bEmpty = b.trim().length === 0
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1

  const ta = tokenizeVersion(a)
  const tb = tokenizeVersion(b)
  const len = Math.min(ta.length, tb.length)
  for (let i = 0; i < len; i++) {
    const x = ta[i]
    const y = tb[i]
    if (typeof x === 'number' && typeof y === 'number') {
      if (x !== y) return x > y ? -1 : 1
    } else if (typeof x === 'string' && typeof y === 'string') {
      if (x !== y) return x < y ? 1 : -1
    } else {
      // A numeric segment ranks above a text one at the same position.
      return typeof x === 'number' ? -1 : 1
    }
  }
  // Shared prefix is identical — the longer version ranks higher.
  if (ta.length !== tb.length) return ta.length > tb.length ? -1 : 1
  return 0
}

// Strips markdown formatting to plain text and truncates with an ellipsis.
// Used for hero/card excerpts, where rendering full markdown (headings,
// lists, code blocks) would overwhelm the layout.
export function markdownExcerpt(markdown: string | null | undefined, maxLen: number): string {
  if (!markdown) return ''
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → label text
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/^\s*([-*+]|\d+[.)])\s+/gm, '') // list markers
    .replace(/^\s*>\s?/gm, '') // blockquotes
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1') // bold / italic / strike
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}
