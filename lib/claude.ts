import Anthropic from '@anthropic-ai/sdk'
import type { AIAnalysisResult } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const ANALYSIS_PROMPT = `You are an expert product analyst for a mobile marketplace. Analyze this image and extract product details.

CRITICAL: You MUST provide a descriptive, specific title. Never return empty or generic titles like "Item", "Product", or "Item for Sale".

Return ONLY valid JSON:
{
  "title": "Descriptive title (3-8 words, e.g., 'Blue Cotton T-Shirt Lot - 50 pieces')",
  "category": "Clothing|Textiles|Electronics|Home|Accessories|Crafts|Other",
  "color": "Primary color or 'Mixed'",
  "material": "Main material if identifiable (cotton, polyester, metal, etc.)",
  "condition": "New|Like New|Good|Fair",
  "suggestedPrice": { "min": number, "max": number }
}

Guidelines for title:
- MUST be specific and descriptive (not "Shirt" but "Blue Cotton T-Shirt")
- Include quantity if bulk items visible (e.g., "T-Shirts (50 pieces)")
- Include key details like color + material + type
- 3-8 words maximum
- No generic terms like "Item", "Product", "Thing"

Guidelines for other fields:
- Category must be one of the listed options
- Material should be specific if visible (cotton, polyester, denim, plastic, metal, wood, etc.)
- suggestedPrice in INR, only if you're confident based on item type and condition
- Condition should reflect visible wear and quality

If you can't identify the item clearly, use descriptive language based on what you see (e.g., "Mixed Textile Items" not "Item for Sale").`

/**
 * Generate fallback title from available data
 * Never returns generic placeholders - builds from available info
 */
function generateFallbackTitle(data: Partial<AIAnalysisResult>): string {
  const parts: string[] = []

  // Build title from available data
  if (data.color && data.color !== 'Mixed') parts.push(data.color)
  if (data.material) parts.push(data.material)
  if (data.category && data.category !== 'Other') parts.push(data.category)

  // If we have enough info, construct a title
  if (parts.length >= 2) {
    return parts.join(' ')
  }

  // Last resort - use category with descriptor
  if (data.category && data.category !== 'Other') {
    return data.category + ' Item'
  }

  // Absolute fallback - return empty to trigger manual input
  return ''
}

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

    // Validate title - never allow generic placeholders
    if (!result.title ||
        result.title === 'Item for Sale' ||
        result.title === 'Product' ||
        result.title === 'Item' ||
        result.title.length < 3) {
      result.title = generateFallbackTitle(result) || ''
    }

    return result
  } catch (error) {
    console.error('Claude Vision analysis failed:', error)

    // Return with best-effort fallback
    const fallbackData: Partial<AIAnalysisResult> = {
      category: 'Other',
      color: null,
      size: null,
      material: null,
      condition: 'New',
      confidence: 0,
    }

    return {
      ...fallbackData,
      title: generateFallbackTitle(fallbackData) || '', // Empty triggers manual input
      category: fallbackData.category!,
      color: fallbackData.color || null,
      size: fallbackData.size || null,
      material: fallbackData.material || null,
      condition: fallbackData.condition || 'New',
      confidence: fallbackData.confidence!,
    }
  }
}
