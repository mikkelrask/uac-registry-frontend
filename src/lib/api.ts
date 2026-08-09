import type { InstallMessage } from '@/lib/types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://db.uac-soft.online'

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, API_BASE)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

// ---- Embedded detection ----

export function isEmbedded(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('embedded')) return true
  if (typeof navigator !== 'undefined' && /\bElectron\b/.test(navigator.userAgent)) return true
  return false
}

// ---- Install handoff ----

export function installProtocol(protocolJson: string): void {
  if (isEmbedded()) {
    const msg: InstallMessage = { type: 'uac-install', protocolUrl: protocolJson }
    window.parent.postMessage(msg, '*')
  } else {
    const blob = new Blob([protocolJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'protocol.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
