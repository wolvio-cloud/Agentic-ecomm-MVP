import { NextRequest, NextResponse } from 'next/server'
import { analyzeProductImage } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Analyze image with Claude Vision
    const result = await analyzeProductImage(imageData, true)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image analysis error:', error)

    // Return conservative defaults on error (graceful degradation)
    return NextResponse.json({
      title: 'Item for Sale',
      category: 'Other',
      color: null,
      size: null,
      confidence: 0,
    })
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout for AI analysis
