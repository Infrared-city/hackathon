import { APIS } from '../../types/index'

interface ApiCheckboxGridProps {
  selected: string[]
  onToggle: (apiName: string) => void
}

export function ApiCheckboxGrid({ selected, onToggle }: ApiCheckboxGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 10,
      }}
    >
      {APIS.map((apiName) => {
        const checked = selected.includes(apiName)
        return (
          <label
            key={apiName}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: checked ? 'var(--cyan-dim)' : 'var(--bg-surface)',
              border: `1px solid ${checked ? 'var(--cyan-border)' : 'var(--border)'}`,
              borderRadius: 8,
              cursor: 'pointer',
              color: checked ? 'var(--cyan)' : 'var(--text-body)',
              fontSize: 14,
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(apiName)}
              style={{ accentColor: '#23E5E5', cursor: 'pointer' }}
            />
            {apiName}
          </label>
        )
      })}
    </div>
  )
}
