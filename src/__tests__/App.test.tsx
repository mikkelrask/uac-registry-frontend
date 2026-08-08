import { describe, it, expect } from 'vitest'
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
    </QueryClientProvider>
  )
}

describe('App routing', () => {
  it('renders home page at /', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'UAC Registry' })).toBeTruthy()
  })

  it('renders mods page at /mods', () => {
    renderApp('/mods')
    expect(screen.getByRole('heading', { name: 'Mods' })).toBeTruthy()
  })

  it('renders protocols page at /protocols', () => {
    renderApp('/protocols')
    expect(screen.getByRole('heading', { name: 'Protocols' })).toBeTruthy()
  })

  it('renders search page at /search', () => {
    renderApp('/search')
    expect(screen.getByRole('heading', { name: 'Search' })).toBeTruthy()
  })

  it('has UAC branding in header', () => {
    renderApp('/')
    expect(screen.getByText('Registry')).toBeTruthy()
  })
})

describe('embedded mode', () => {
  it('renders the home content even when embedded', () => {
    renderApp('/?embedded=1')
    // The main content should render regardless of embedded mode
    expect(screen.getByRole('heading', { name: 'UAC Registry' })).toBeTruthy()
  })
})
