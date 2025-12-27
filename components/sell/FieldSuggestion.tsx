'use client'

import { useState } from 'react'

interface FieldSuggestionProps {
  label: string
  suggestion: string | null
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  type?: 'text' | 'select'
  options?: string[]
}

export function FieldSuggestion({
  label,
  suggestion,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  options = [],
}: FieldSuggestionProps) {
  const [isEditing, setIsEditing] = useState(!suggestion)
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    if (suggestion) {
      onChange(suggestion)
      setAccepted(true)
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setAccepted(false)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* AI Suggestion Banner */}
      {suggestion && !accepted && !isEditing && (
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 animate-fade-up">
          <p className="text-xs text-accent font-medium mb-1">AI suggests:</p>
          <p className="text-ink font-medium mb-3">{suggestion}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl transition-transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Accept
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-ink/10 text-ink text-sm font-medium rounded-xl transition-transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Accepted State */}
      {accepted && !isEditing && (
        <div className="flex items-center justify-between bg-surface border border-ink/10 rounded-xl p-4">
          <span className="text-ink font-medium">{value}</span>
          <button
            type="button"
            onClick={handleEdit}
            className="text-sm text-accent font-medium hover:underline"
          >
            Change
          </button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <>
          {type === 'select' && options.length > 0 ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-14 px-4 border-2 border-ink/10 rounded-xl bg-surface text-ink
                focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                transition-all tap-highlight-none"
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-14 px-4 border-2 border-ink/10 rounded-xl bg-surface text-ink placeholder:text-muted
                focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                transition-all tap-highlight-none"
            />
          )}
        </>
      )}
    </div>
  )
}
