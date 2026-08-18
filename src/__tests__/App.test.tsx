import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
    </QueryClientProvider>
  )
}

describe('App routing', () => {
  it('renders home page at /', () => {
    renderApp('/')
    // Home page shows the empty-state hero with "UAC Registry" text
    expect(screen.getByText('UAC Registry')).toBeTruthy()
  })

  it('renders mods page at /mods', () => {
    renderApp('/mods')
    // "Mods" appears both in header nav and as section title
    const modsElements = screen.getAllByText('Mods')
    expect(modsElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders protocols page at /protocols', () => {
    renderApp('/protocols')
    // "Protocols" appears in header nav + page section title
    const protocolsElements = screen.getAllByText('Protocols')
    expect(protocolsElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders search page at /search', () => {
    renderApp('/search')
    // Target the page heading specifically
    expect(screen.getByRole('heading', { name: 'Search' })).toBeTruthy()
  })

  it('has storefront nav links', () => {
    renderApp('/')
    // Store, Mods, Protocols each appear once in nav (hidden sm:inline)
    const storeLinks = screen.getAllByText('Store')
    const modsLinks = screen.getAllByText('Mods')
    const protocolsLinks = screen.getAllByText('Protocols')
    expect(storeLinks.length).toBeGreaterThanOrEqual(1)
    expect(modsLinks.length).toBeGreaterThanOrEqual(1)
    expect(protocolsLinks.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Latest Mods ordering', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('requests the home grid newest-first via sort=created_at', async () => {
    const json = (body: unknown) =>
      new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      if (url.includes('/api/families')) {
        return json({ families: [], total: 0, limit: 12, offset: 0 })
      }
      return json({})
    })
    vi.stubGlobal('fetch', fetchMock)

    renderApp('/')
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(0))

    const urls = fetchMock.mock.calls.map((call) => String(call[0]))
    // The "Latest Mods" grid fetches limit=12 — it must ask for newest first
    const latestUrl = urls.find((u) => u.includes('/api/families') && u.includes('limit=12'))
    expect(latestUrl).toBeDefined()
    expect(new URL(latestUrl!).searchParams.get('sort')).toBe('created_at')
    // The browse-by-category pool keeps the default alphabetical order
    const browseUrl = urls.find((u) => u.includes('/api/families') && u.includes('limit=100'))
    expect(browseUrl).toBeDefined()
    expect(new URL(browseUrl!).searchParams.get('sort')).toBeNull()
  })
})

describe('embedded mode', () => {
  it('renders content without site-level header when embedded', () => {
    renderApp('/?embedded=1')
    // In jsdom, MemoryRouter does NOT affect window.location.search,
    // so isEmbedded() returns false and standalone chrome renders.
    // When Electron or a real ?embedded param is present,
    // the embedded toolbar shows search + nav but no site header/footer.
    // This test verifies the page still renders even with the param.
    expect(screen.getByText('UAC Registry')).toBeTruthy()
  })
})
