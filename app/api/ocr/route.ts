import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const apiKey = process.env.NANONETS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Nanonets API key not configured. Please add NANONETS_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // Create FormData for Nanonets Extraction API
    const nanoFormData = new FormData()
    nanoFormData.append("file", file)
    nanoFormData.append("output_format", "markdown")

    // Call Nanonets Extraction API - synchronous endpoint
    const endpoint = "https://extraction-api.nanonets.com/api/v1/extract/sync"
    console.log("[v0] Calling Nanonets endpoint:", endpoint)
    console.log("[v0] API Key (first 10 chars):", apiKey.substring(0, 10) + "...")

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: nanoFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Nanonets API error:", response.status, errorText)
      console.error("[v0] API Key (first 10 chars):", apiKey.substring(0, 10) + "...")
      
      return NextResponse.json(
        { error: `Nanonets API error: ${response.status}. ${errorText}` },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("[v0] Nanonets response received")
    console.log("[v0] Full Nanonets response:", JSON.stringify(result, null, 2))

    let recognizedText = ""
    let confidence = 0.9
    const characterList: string[] = []

    // Extract text from markdown content - Nanonets returns result.result.markdown.content
    if (result.result && result.result.markdown && result.result.markdown.content) {
      recognizedText = result.result.markdown.content
      console.log("[v0] Content extracted from result.result.markdown.content")
    } else if (result.content) {
      recognizedText = result.content
      console.log("[v0] Content extracted from response")
    } else if (result.data && result.data.content) {
      recognizedText = result.data.content
      console.log("[v0] Content extracted from data field")
    } else if (result.extracted_text) {
      recognizedText = result.extracted_text
      console.log("[v0] Content extracted from extracted_text field")
    }

    // Extract individual characters
    if (recognizedText) {
      for (const char of recognizedText) {
        characterList.push(char)
      }
    }

    // Fallback if no text was recognized
    if (!recognizedText || recognizedText.trim().length === 0) {
      recognizedText = "No text could be recognized in this image."
      confidence = 0
    }

    console.log("[v0] Text extracted successfully")
    console.log("[v0] Text length:", recognizedText.length)
    console.log("[v0] Confidence:", confidence)

    return NextResponse.json({
      text: recognizedText,
      characters: characterList,
      confidence: Math.round(confidence * 100) / 100,
    })
  } catch (error) {
    console.error("[v0] OCR processing error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
