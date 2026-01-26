"use client"

import { useState, useEffect } from "react"
import ImageUpload from "@/components/image-upload"
import ComparisonDisplay from "@/components/comparison-display"
import Header from "@/components/header"
import HistoryPanel from "@/components/history-panel"

interface ProcessedResult {
  id: string
  timestamp: number
  originalImage: string
  recognizedText: string
  characterList: string[]
  confidence: number
  fileName: string
}

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [recognizedText, setRecognizedText] = useState<string>("")
  const [characterList, setCharacterList] = useState<string[]>([])
  const [confidence, setConfidence] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [history, setHistory] = useState<ProcessedResult[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [currentFileName, setCurrentFileName] = useState<string>("")

  useEffect(() => {
    const savedHistory = localStorage.getItem("clarifi_history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch {
        console.error("Failed to load history")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("clarifi_history", JSON.stringify(history))
  }, [history])

  const handleRecognition = (image: string, text: string, chars: string[], conf: number, fileName: string) => {
    setOriginalImage(image)
    setRecognizedText(text)
    setCharacterList(chars)
    setConfidence(conf)
    setCurrentFileName(fileName)

    const newResult: ProcessedResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalImage: image,
      recognizedText: text,
      characterList: chars,
      confidence: conf,
      fileName: fileName,
    }
    setHistory([newResult, ...history.slice(0, 49)])
  }

  const clearResults = () => {
    setOriginalImage(null)
    setRecognizedText("")
    setCharacterList([])
    setConfidence(0)
    setCurrentFileName("")
  }

  const loadFromHistory = (result: ProcessedResult) => {
    setOriginalImage(result.originalImage)
    setRecognizedText(result.recognizedText)
    setCharacterList(result.characterList)
    setConfidence(result.confidence)
    setCurrentFileName(result.fileName)
    setShowHistory(false)
  }

  const clearAllHistory = () => {
    setHistory([])
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onHistoryClick={() => setShowHistory(!showHistory)} hasHistory={history.length > 0} />

      {!originalImage ? (
        <>
          {/* Hero Section */}
          <section className="py-24 md:py-32 px-4">
            <div className="container mx-auto max-w-2xl text-center space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground">
                Transform unclear text into crystal clarity
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                Upload any handwritten document or image. Our AI instantly recognizes and extracts every character with precision.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3 text-lg bg-foreground text-background font-medium hover:bg-primary/90 transition-colors"
                >
                  Get started
                </button>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section id="upload-section" className="py-16 md:py-24 px-4 bg-muted/30">
            <div className="container mx-auto max-w-2xl">
              <ImageUpload
                onRecognition={handleRecognition}
                onProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24 md:py-32 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-light text-center text-foreground mb-4">How it works</h2>
              <p className="text-center text-muted-foreground text-lg mb-16">Three simple steps to clarify your documents</p>

              <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                {/* Step 1 */}
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="text-5xl font-light text-muted-foreground">01</div>
                  </div>
                  <h3 className="text-2xl font-light text-foreground">Upload</h3>
                  <p className="text-muted-foreground leading-relaxed">Drag and drop any handwritten document or take a photo of your text</p>
                </div>

                {/* Step 2 */}
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="text-5xl font-light text-muted-foreground">02</div>
                  </div>
                  <h3 className="text-2xl font-light text-foreground">Process</h3>
                  <p className="text-muted-foreground leading-relaxed">Our AI engine analyzes and recognizes every character with high accuracy</p>
                </div>

                {/* Step 3 */}
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="text-5xl font-light text-muted-foreground">03</div>
                  </div>
                  <h3 className="text-2xl font-light text-foreground">Get Results</h3>
                  <p className="text-muted-foreground leading-relaxed">View, copy, download, or edit your perfectly extracted text</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container mx-auto max-w-4xl px-4 pt-8 md:pt-12">
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex-1 space-y-6">
              <ComparisonDisplay
                originalImage={originalImage}
                recognizedText={recognizedText}
                characterList={characterList}
                confidence={confidence}
                onClear={clearResults}
                fileName={currentFileName}
              />
            </div>

            {showHistory && history.length > 0 && (
              <HistoryPanel history={history} onSelect={loadFromHistory} onClearAll={clearAllHistory} />
            )}
          </div>
        </div>
      )}
    </main>
  )
}
