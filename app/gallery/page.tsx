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

      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mb-12">
          <Link href="/">
            <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 mb-6">
              <span>←</span> Back
            </button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">History</h1>
            <p className="text-lg text-muted-foreground">View your previously processed documents</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Search</label>
            <input
              type="text"
              placeholder="Search by filename or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "accuracy")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="accuracy">Highest Accuracy</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
              <div className="text-6xl">📄</div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">No documents yet</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start processing documents to build your history. Every scan will appear here.
            </p>
            <Link href="/">
              <button className="inline-flex px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                Process Your First Document
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredResults.length}</span> document{filteredResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Preview */}
                  <div className="relative w-full h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <img
                      src={result.originalImage || "/placeholder.svg"}
                      alt={result.fileName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-2 rounded-full text-xs font-bold shadow-lg">
                      <span>✓</span>
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground truncate text-base">{result.fileName}</h3>
                      <p className="text-xs text-muted-foreground">{formatDate(result.timestamp)}</p>
                    </div>

                    {/* Text Preview */}
                    <div className="bg-muted/60 rounded-lg p-4 text-sm text-foreground line-clamp-3 min-h-20">
                      {result.recognizedText || <span className="text-muted-foreground italic">No text recognized</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.recognizedText)
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteResult(result.id)}
                        className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-semibold hover:bg-destructive/20 hover:text-destructive transition-all duration-200 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
