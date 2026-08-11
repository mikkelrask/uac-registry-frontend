import { useParams } from 'react-router-dom'
import { ModFamilyDetail } from '@/components/ModFamilyDetail'
import { ModFileDetail } from '@/components/ModFileDetail'

// A registered mod file is a 32-char hex MD5; family ids are UUIDs.
const MOD_HASH_RE = /^[a-f0-9]{32}$/

export function ModDetailPage() {
  const { familyName } = useParams<{ familyName: string }>()

  if (familyName && MOD_HASH_RE.test(familyName)) {
    return <ModFileDetail hash={familyName} />
  }
  return <ModFamilyDetail />
}
