import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${compact ? '' : 'w-full max-w-lg'}`}>
      <Input
        type="search"
        placeholder="Search mods & protocols..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="uac" size={compact ? 'sm' : 'default'}>
        <Search className="size-4" />
        {!compact && <span>Search</span>}
      </Button>
    </form>
  )
}
