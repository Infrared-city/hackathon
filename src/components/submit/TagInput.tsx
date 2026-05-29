import { useState, type KeyboardEvent } from 'react'
import { inputStyle } from '../ui/FormPrimitives'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  max?: number
}

export function TagInput({ value, onChange, placeholder, max = 10 }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const t = draft.trim().replace(/,$/, '').trim()
    if (t && value.length < max && !value.some((v) => v.toLowerCase() === t.toLowerCase())) {
      onChange([...value, t])
    }
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {value.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan-border)',
                color: 'var(--cyan)',
                fontSize: 13,
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== tag))}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                }}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        style={inputStyle}
        placeholder={value.length >= max ? `Max ${max} tags` : (placeholder ?? 'Type a tag, press Enter')}
        disabled={value.length >= max}
        data-testid="tag-input"
      />
    </div>
  )
}
