"use client"

import { useState } from "react"

interface HistoryItem {
  id: string
  timestamp: number
  originalImage: string
  recognizedText: string
  characterList: string[]
  confidence: number
  fileName: string
}

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClearAll: () => void
}

export default function HistoryPanel({ history, onSelect, onClearAll }: HistoryPanelProps) {
  const [confirmClear, setConfirmClear] = useState(false)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="w-full lg:w-80 bg-muted/50 border border-border rounded-2xl p-4 space-y-4 max-h-96 overflow-y-auto sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">📋 History</h3>
        <button
          onClick={() => setConfirmClear(true)}
          className="text-xs px-3 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all"
        >
          Clear
        </button>
      </div>

      {/* Clear Confirmation */}
      {confirmClear && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-3">
          <p className="text-xs font-semibold text-foreground">Clear all history?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClearAll()
                setConfirmClear(false)
              }}
              className="flex-1 text-xs py-2 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-all font-semibold"
            >
              Clear All
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="flex-1 text-xs py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-all border border-border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* History Items */}
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-lg bg-background border border-border hover:border-accent hover:bg-accent/5 transition-all space-y-2 group"
          >
            <div className="flex gap-2">
              <img
                src={item.originalImage || "/placeholder.svg"}
                alt={item.fileName}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                  {item.fileName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{item.recognizedText.substring(0, 30)}...</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(item.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-semibold text-accent">{(item.confidence * 100).toFixed(0)}%</span>
              <span className="text-xs text-muted-foreground">{item.characterList.length} chars</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
