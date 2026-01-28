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
    <main className="min-h-screen bg-background pb-8">
      <Header onHistoryClick={() => setShowHistory(!showHistory)} hasHistory={history.length > 0} />

      <div className="container mx-auto max-w-4xl px-4 pt-6 md:pt-8">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {!originalImage ? (
              <ImageUpload
                onRecognition={handleRecognition}
                onProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            ) : (
              <ComparisonDisplay
                originalImage={originalImage}
                recognizedText={recognizedText}
                characterList={characterList}
                confidence={confidence}
                onClear={clearResults}
                fileName={currentFileName}
              />
            )}
          </div>

          {/* History Panel */}
          {showHistory && history.length > 0 && (
            <HistoryPanel history={history} onSelect={loadFromHistory} onClearAll={clearAllHistory} />
          )}
        </div>
      </div>
    </main>
  )
}
