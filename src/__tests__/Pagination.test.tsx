import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/Pagination'

describe('Pagination', () => {
  it('renders page info and windowed page buttons', () => {
    render(
      <Pagination
        page={3}
        pageSize={24}
        total={250}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Page 3 of 11 · 250 total')).toBeTruthy()
    for (const label of ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5']) {
      expect(screen.getByLabelText(label)).toBeTruthy()
    }
  })

  it('disables prev/next at the bounds', () => {
    const onPageChange = vi.fn()
    const { rerender } = render(
      <Pagination page={1} pageSize={24} total={24} onPageChange={onPageChange} onPageSizeChange={vi.fn()} />,
    )
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()

    rerender(
      <Pagination page={2} pageSize={24} total={48} onPageChange={onPageChange} onPageSizeChange={vi.fn()} />,
    )
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('reports page clicks and page-size changes', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    render(
      <Pagination
        page={3}
        pageSize={24}
        total={250}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )
    fireEvent.click(screen.getByLabelText('Page 5'))
    expect(onPageChange).toHaveBeenCalledWith(5)

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(4)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '48' } })
    expect(onPageSizeChange).toHaveBeenCalledWith(48)
  })

  it('clamps an out-of-range page for display but keeps the info line honest', () => {
    render(
      <Pagination page={99} pageSize={24} total={250} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />,
    )
    // total 250 / 24 = 11 pages; 99 clamps to 11
    expect(screen.getByText('Page 11 of 11 · 250 total')).toBeTruthy()
  })
})
