import { Routes, Route } from 'react-router-dom'
import { UacLayout } from '@/components/UacLayout'
import { HomePage } from '@/pages/HomePage'
import { ModsPage } from '@/pages/ModsPage'
import { ModDetailPage } from '@/pages/ModDetailPage'
import { ProtocolsPage } from '@/pages/ProtocolsPage'
import { ProtocolDetailPage } from '@/pages/ProtocolDetailPage'
import { SearchPage } from '@/pages/SearchPage'

export default function App() {
  return (
    <UacLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mods" element={<ModsPage />} />
        <Route path="/mods/:familyName" element={<ModDetailPage />} />
        <Route path="/protocols" element={<ProtocolsPage />} />
        <Route path="/protocols/:slug" element={<ProtocolDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </UacLayout>
  )
}
