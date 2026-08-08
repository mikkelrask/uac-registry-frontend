import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Screenshot } from '@/lib/types'

export function ScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  const [selected, setSelected] = useState<number | null>(null)

  if (!screenshots.length) return null

  return (
    <div>
      <h3 className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-2">
        Screenshots
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {screenshots.map((shot, i) => (
          <button
            key={shot.id}
            onClick={() => setSelected(i)}
            className="shrink-0 w-40 h-24 border border-border hover:border-accent-highlight/50 transition-colors overflow-hidden"
          >
            <img
              src={shot.url}
              alt={shot.caption || `Screenshot ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setSelected(null)}
          >
            <X className="size-6" />
          </button>
          {selected > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setSelected(selected - 1) }}
            >
              <ChevronLeft className="size-8" />
            </button>
          )}
          <img
            src={screenshots[selected].url}
            alt={screenshots[selected].caption || `Screenshot ${selected + 1}`}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selected < screenshots.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setSelected(selected + 1) }}
            >
              <ChevronRight className="size-8" />
            </button>
          )}
          {screenshots[selected].caption && (
            <p className="absolute bottom-4 text-sm text-white/80 bg-black/50 px-3 py-1">
              {screenshots[selected].caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
