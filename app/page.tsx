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
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-transparent to-accent/10 py-20 md:py-32">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                      AI-Powered Recognition
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                      Turn handwriting into text instantly
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Upload any handwritten document and let our advanced AI technology extract and digitize the text with remarkable accuracy. No more manual typing.
                  </p>
                  <button
                    onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Start Processing
                  </button>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border-2 border-primary/30">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">📄</div>
                      <p className="text-muted-foreground font-medium">Upload documents here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="container mx-auto max-w-5xl">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="text-4xl">⚡</div>
                  <h3 className="text-xl font-bold text-foreground">Lightning Fast</h3>
                  <p className="text-muted-foreground">Process documents in seconds with our optimized AI engine</p>
                </div>
                <div className="space-y-4 p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-xl font-bold text-foreground">Highly Accurate</h3>
                  <p className="text-muted-foreground">Advanced recognition with exceptional accuracy rates</p>
                </div>
                <div className="space-y-4 p-6 rounded-xl bg-card border border-border hover:border-secondary/50 transition-colors">
                  <div className="text-4xl">🔒</div>
                  <h3 className="text-xl font-bold text-foreground">Private & Safe</h3>
                  <p className="text-muted-foreground">Your documents stay local, never uploaded to servers</p>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section id="upload-section" className="py-16 md:py-24 px-4 bg-muted/40">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Upload Your Document</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Drag and drop any handwritten document or click to browse
              </p>
              <ImageUpload
                onRecognition={handleRecognition}
                onProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">How it works</h2>
              <p className="text-center text-muted-foreground mb-16">Simple three-step process to digitize your documents</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Upload</h3>
                    <p className="text-muted-foreground">Select or drag a handwritten document image</p>
                  </div>
                  {/* Connector line */}
                  <div className="hidden md:block absolute top-8 left-[calc(100%+0px)] w-8 h-1 bg-gradient-to-r from-primary to-transparent"></div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold text-2xl">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Process</h3>
                    <p className="text-muted-foreground">AI analyzes and recognizes all characters</p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-[calc(100%+0px)] w-8 h-1 bg-gradient-to-r from-secondary to-transparent"></div>
                </div>

                <div>
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-2xl">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Export</h3>
                    <p className="text-muted-foreground">Download or copy your digitized text</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container mx-auto max-w-4xl px-4 pt-8 md:pt-12 pb-12">
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
