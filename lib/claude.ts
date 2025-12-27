import Anthropic from '@anthropic-ai/sdk'
import type { AIAnalysisResult } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const ANALYSIS_PROMPT = `You are an expert product cataloger for a mobile marketplace.

Analyze this product image and extract:
1. title: A concise, sellable product name (max 50 chars, no brand names unless clearly visible)
2. category: One of [Clothing, Electronics, Home, Accessories, Textiles, Crafts, Other]
3. color: Primary color (simple terms: Red, Blue, White, etc.)
4. size: If applicable and visible (S, M, L, XL, or dimensions)

Respond ONLY with valid JSON:
{
  "title": "string",
  "category": "string",
  "color": "string or null",
  "size": "string or null",
  "confidence": 0.0-1.0
}

Be conservative. If unsure, use generic terms. The seller will confirm.`

/**
 * Analyzes a product image using Claude Vision API
 */
export async function analyzeProductImage(
  imageData: string,
  isBase64: boolean = true
): Promise<AIAnalysisResult> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageData,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    })

    // Extract JSON from response
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response')
    }

    const result = JSON.parse(jsonMatch[0]) as AIAnalysisResult

    return result
  } catch (error) {
    console.error('Claude Vision analysis failed:', error)

    // Return conservative defaults on error
    return {
      title: 'Item for Sale',
      category: 'Other',
      color: null,
      size: null,
      confidence: 0,
    }
  }
}
