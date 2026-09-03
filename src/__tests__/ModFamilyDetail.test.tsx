import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'

function renderApp(initialRoute = '/') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

// Family detail returned by /api/families/:id — versions in API order
// (newest approved first), deliberately out of version order.
const FAMILY = {
  id: 'fam-1',
  name: 'Test Family',
  category: null,
  author: null,
  website: null,
  thumbnail_url: null,
  description: null,
  screenshots: [],
  is_sidecar: 0,
  versions: [
    {
      hash: 'h-2-0-a',
      family_name: 'Test Family',
      display_name: 'two-point-oh-a.pk3',
      version: '2.0',
      category: null,
      approved_at: 1700000005,
      urls: [{ url: 'https://example.com/2-0-a.pk3', domain: 'example.com' }],
    },
    {
      hash: 'h-1-0',
      family_name: 'Test Family',
      display_name: 'one-point-oh.pk3',
      version: '1.0',
      category: null,
      approved_at: 1700000004,
      urls: [{ url: 'https://example.com/1-0.pk3', domain: 'example.com' }],
    },
    {
      hash: 'h-unv',
      family_name: 'Test Family',
      display_name: 'nightly.pk3',
      version: null,
      category: null,
      approved_at: 1700000003,
      urls: [{ url: 'https://example.com/nightly.pk3', domain: 'example.com' }],
    },
    {
      hash: 'h-9-1',
      family_name: 'Test Family',
      display_name: 'nine-one.pk3',
      version: '9.1',
      category: null,
      approved_at: 1700000002,
      urls: [{ url: 'https://example.com/9-1.pk3', domain: 'example.com' }],
    },
    {
      hash: 'h-10-0',
      family_name: 'Test Family',
      display_name: 'ten-point-oh.pk3',
      version: '10.0',
      category: null,
      approved_at: 1700000001,
      urls: [{ url: 'https://example.com/10-0.pk3', domain: 'example.com' }],
    },
    {
      hash: 'h-2-0-b',
      family_name: 'Test Family',
      display_name: 'two-point-oh-b.pk3',
      version: '2.0',
      category: null,
      approved_at: 1700000000,
      urls: [{ url: 'https://example.com/2-0-b.pk3', domain: 'example.com' }],
    },
  ],
}

describe('ModFamilyDetail Files ordering', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('lists version groups highest-first with natural numeric ordering', async () => {
    const json = (body: unknown) =>
      new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      if (url.includes('/api/families/fam-1')) {
        return json(FAMILY)
      }
      return json({})
    })
    vi.stubGlobal('fetch', fetchMock)

    renderApp('/mods/fam-1')

    const headings = await screen.findAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toEqual([
      'v10.0 · 1 file',
      'v9.1 · 1 file',
      'v2.0 · 2 files',
      'v1.0 · 1 file',
      'Unversioned · 1 file',
    ])
  })
})
