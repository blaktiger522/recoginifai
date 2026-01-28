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
  const cameraRef = useRef<HTMLInputElement>(null)
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
          className={`relative rounded-2xl p-12 md:p-16 text-center transition-all duration-300 ${
            isDragging ? "bg-primary/10 scale-105" : "bg-muted/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleChange}
            className="hidden"
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-foreground">Upload your document</p>
              <p className="text-base md:text-lg text-muted-foreground">Drag & drop an image, or use the buttons below</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-col pt-2 w-full">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="w-full px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Capture Photo
              </button>
            </div>

            {/* Support Text */}
            <p className="text-sm text-muted-foreground">Supports PNG, JPG, JPEG • Max 10MB</p>
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
