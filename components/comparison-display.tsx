"use client"

import { useState, useEffect } from "react"

interface ComparisonDisplayProps {
  originalImage: string
  recognizedText: string
  characterList: string[]
  confidence: number
  onClear: () => void
  fileName: string
}

export default function ComparisonDisplay({
  originalImage,
  recognizedText,
  characterList,
  confidence,
  onClear,
  fileName,
}: ComparisonDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical")

  useEffect(() => {
    const savedLayout = localStorage.getItem("clarifi_layout") as "vertical" | "horizontal" | null
    if (savedLayout) {
      setLayout(savedLayout)
    }
  }, [])

  const handleLayoutChange = (newLayout: "vertical" | "horizontal") => {
    setLayout(newLayout)
    localStorage.setItem("clarifi_layout", newLayout)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recognizedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyWord = (word: string) => {
    navigator.clipboard.writeText(word)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([recognizedText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName.replace(/\.[^/.]+$/, "")}_recognized.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Layout Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Results</h2>
        <div className="flex gap-2 bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => handleLayoutChange("vertical")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              layout === "vertical"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Stack vertically: Image above, text below"
          >
            Vertical
          </button>
          <button
            onClick={() => handleLayoutChange("horizontal")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              layout === "horizontal"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Side by side: Image left, text right"
          >
            Horizontal
          </button>
        </div>
      </div>

      {/* Comparison Container */}
      <div
        className={`${
          layout === "vertical" ? "space-y-8" : "grid gap-8"
        } ${layout === "horizontal" ? "lg:grid-cols-2" : ""}`}
      >
        {/* Original Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">📄 Original</h3>
              <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold border border-border">
              Before
            </span>
          </div>
          <div className="relative bg-muted rounded-2xl overflow-hidden border border-border shadow-lg">
            <img src={originalImage || "/placeholder.svg"} alt="Original" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Processed Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">✨ Recognized</h3>
            <span className="text-xs bg-accent/20 text-accent px-4 py-2 rounded-full font-semibold border border-accent/30">
              After
            </span>
          </div>

          {/* Main Recognized Text */}
          <div className="bg-gradient-to-br from-accent/8 to-secondary/8 border border-accent/20 rounded-2xl p-8 space-y-5 shadow-lg h-full flex flex-col justify-between">
            <p className="text-lg md:text-xl font-bold text-foreground break-words leading-relaxed text-balance">
              {recognizedText}
            </p>

            {/* Confidence Score */}
            <div className="space-y-3 pt-5 border-t border-accent/15">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Accuracy</span>
                <span className="text-2xl font-bold text-accent">{(confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-700"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">🔤 Character Breakdown</h3>
        <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex flex-wrap gap-2">
            {characterList.map((char, idx) => (
              <div
                key={idx}
                className="inline-flex items-center justify-center min-w-14 h-14 bg-background border border-border rounded-lg font-bold text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
                onClick={() => copyWord(char)}
                title="Click to copy"
              >
                {char === " " ? "·" : char}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground border-t border-border pt-4">
            Total Characters: <span className="font-bold text-foreground">{characterList.length}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col md:flex-row pt-4">
        <button
          onClick={onClear}
          className="flex-1 py-4 px-6 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-all duration-300 border border-border hover:shadow-md"
        >
          New Upload
        </button>
        <button
          onClick={downloadText}
          className="flex-1 py-4 px-6 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-all duration-300 border border-border hover:shadow-md"
        >
          Download Text
        </button>
        <button
          onClick={copyToClipboard}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
        >
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
    </div>
  )
}
