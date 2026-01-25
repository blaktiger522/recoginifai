"use client"

import { useState } from "react"

interface ResultsDisplayProps {
  text: string
  confidence: number
}

export default function ResultsDisplay({ text, confidence }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-accent/30 p-6 md:p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recognized Text</h3>
        <p className="text-xl md:text-2xl font-semibold text-foreground break-words">{text}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Confidence Level</span>
          <span className="font-semibold text-accent">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-500"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={copyToClipboard}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        {copied ? <>✓ Copied to clipboard</> : <>📋 Copy Text</>}
      </button>
    </div>
  )
}
