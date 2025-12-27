'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import type { AIAnalysisResult } from '@/types'

interface AISuggestionsProps {
  suggestions: AIAnalysisResult
  onUpdate: (field: string, value: string) => void
}

const CATEGORIES = [
  'Clothing',
  'Electronics',
  'Home',
  'Accessories',
  'Textiles',
  'Crafts',
  'Other',
]

export function AISuggestions({ suggestions, onUpdate }: AISuggestionsProps) {
  const { t } = useTranslations()
  const [editingField, setEditingField] = useState<string | null>(null)

  const fields = [
    {
      key: 'title',
      label: 'Title',
      value: suggestions.title,
      type: 'text',
      maxLength: 100,
    },
    {
      key: 'category',
      label: 'Category',
      value: suggestions.category,
      type: 'select',
      options: CATEGORIES,
    },
    {
      key: 'color',
      label: 'Color',
      value: suggestions.color,
      type: 'text',
      optional: true,
    },
    {
      key: 'size',
      label: 'Size',
      value: suggestions.size,
      type: 'text',
      optional: true,
    },
  ]

  return (
    <div className="space-y-4">
      {/* AI Badge */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <span>{t('confirm.ai_suggested')}</span>
        <span className="text-accent">•</span>
        <span>{t('confirm.editing')}</span>
      </div>

      {/* Editable fields */}
      {fields.map((field, index) => (
        <div
          key={field.key}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <label className="block text-sm font-medium text-muted mb-2">
            {field.label}
            {field.optional && (
              <span className="text-xs text-muted/50 ml-1">(optional)</span>
            )}
          </label>

          {field.type === 'select' ? (
            <select
              value={field.value || ''}
              onChange={(e) => onUpdate(field.key, e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-ink/10 bg-surface text-ink
                focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                transition-all tap-highlight-none"
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {t(`category.${option.toLowerCase()}`)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={field.value || ''}
              onChange={(e) => onUpdate(field.key, e.target.value)}
              maxLength={field.maxLength}
              placeholder={field.optional ? 'Not specified' : ''}
              className="w-full h-12 px-4 rounded-xl border-2 border-ink/10 bg-surface text-ink
                placeholder:text-muted/30
                focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                transition-all tap-highlight-none"
            />
          )}
        </div>
      ))}
    </div>
  )
}
