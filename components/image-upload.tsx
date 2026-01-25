"use client"

import type React from "react"

import { useRef, useState } from "react"

interface ImageUploadProps {
  onRecognition: (image: string, text: string, chars: string[], confidence: number, fileName: string) => void
  onProcessing: (processing: boolean) => void
  isProcessing: boolean
}

export default function ImageUpload({ onRecognition, onProcessing, isProcessing }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setFileName(file.name)
    setCurrentFile(file)
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setPreview(imageData)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const isImage = file.type.startsWith("image/")
      const isDocument =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/plain"

      if (isImage || isDocument) {
        handleFileSelect(file)
      }
    }
  }

  const recognizeText = async () => {
    if (!preview || !currentFile) return

    onProcessing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", currentFile)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image")
      }

      console.log("[v0] OCR result:", data)

      onRecognition(preview, data.text, data.characters, data.confidence, fileName)
    } catch (err) {
      console.error("[v0] Recognition error:", err)
      setError(err instanceof Error ? err.message : "Failed to recognize text. Please try again.")
    } finally {
      onProcessing(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setFileName("")
    setCurrentFile(null)
    setError("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 bg-gradient-to-br ${
            isDragging
              ? "border-accent bg-accent/10 scale-105 shadow-lg"
              : "border-border hover:border-accent/50 bg-muted/30 hover:bg-accent/5"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="space-y-5">
            <div className="text-7xl">📤</div>
            <div className="space-y-3">
              <p className="text-xl md:text-2xl font-bold text-foreground">Upload Your Document</p>
              <p className="text-sm md:text-base text-muted-foreground">Drag and drop or click to select</p>
              <p className="text-xs md:text-sm text-muted-foreground/70">
                Images: JPG, PNG, GIF, WebP • Documents: PDF, Word, Excel, TXT
              </p>
            </div>
            <button
              type="button"
              className="mt-8 px-10 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-block shadow-lg hover:scale-105 active:scale-95"
            >
              Upload Files
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="relative bg-muted rounded-2xl overflow-hidden border border-border shadow-lg">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto object-cover max-h-96" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm font-semibold truncate">{fileName}</p>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-xl p-4">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-4 flex-col-reverse md:flex-row">
            <button
              onClick={clearPreview}
              className="flex-1 py-4 px-6 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-all duration-300 border border-border"
            >
              Change Document
            </button>
            <button
              onClick={recognizeText}
              disabled={isProcessing}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚙️</span>
                  Processing...
                </span>
              ) : (
                "Recognize Text"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
