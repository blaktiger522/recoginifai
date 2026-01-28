"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"

interface ProcessedResult {
  id: string
  timestamp: number
  originalImage: string
  recognizedText: string
  characterList: string[]
  confidence: number
  fileName: string
}

export default function GalleryPage() {
  const [results, setResults] = useState<ProcessedResult[]>([])
  const [filteredResults, setFilteredResults] = useState<ProcessedResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "accuracy">("newest")

  useEffect(() => {
    const savedHistory = localStorage.getItem("clarifi_history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setResults(parsed)
        setFilteredResults(parsed)
      } catch {
        console.error("Failed to load results")
      }
    }
  }, [])

  useEffect(() => {
    const filtered = results.filter(
      (result) =>
        result.recognizedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (sortBy === "newest") {
      filtered.sort((a, b) => b.timestamp - a.timestamp)
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.timestamp - b.timestamp)
    } else if (sortBy === "accuracy") {
      filtered.sort((a, b) => b.confidence - a.confidence)
    }

    setFilteredResults(filtered)
  }, [searchQuery, sortBy, results])

  const deleteResult = (id: string) => {
    const updated = results.filter((r) => r.id !== id)
    setResults(updated)
    localStorage.setItem("clarifi_history", JSON.stringify(updated))
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onHistoryClick={() => {}} hasHistory={false} />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 mb-4">
              <span>←</span> Back to Scanner
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Results Gallery</h1>
          <p className="text-muted-foreground">Browse, search, and manage all your processed documents</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Search</label>
            <input
              type="text"
              placeholder="Search by file name or recognized text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "accuracy")}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="accuracy">Highest Accuracy</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No results yet</h2>
            <p className="text-muted-foreground mb-6">Start scanning documents to build your gallery</p>
            <Link href="/">
              <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Start Scanning
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                {/* Image Preview */}
                <div className="relative w-full h-48 bg-muted overflow-hidden">
                  <img
                    src={result.originalImage || "/placeholder.svg"}
                    alt={result.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {Math.round(result.confidence * 100)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground truncate text-sm">{result.fileName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(result.timestamp)}</p>
                  </div>

                  {/* Text Preview */}
                  <div className="bg-muted rounded p-3 text-sm text-foreground line-clamp-2">
                    {result.recognizedText || "No text recognized"}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.recognizedText)
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                      title="Copy recognized text"
                    >
                      Copy Text
                    </button>
                    <button
                      onClick={() => deleteResult(result.id)}
                      className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
                      title="Delete result"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
