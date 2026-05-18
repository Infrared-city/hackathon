import type { Participant } from '../types'

const AVATARS = ['🧑‍💻', '👩‍💻', '🧑‍🔬', '👩‍🔬', '🏗️', '🌆', '🗺️', '🤖']

export function avatarFor(nickname: string): string {
  if (!nickname) return AVATARS[0]
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = (hash * 31 + nickname.charCodeAt(i)) >>> 0
  }
  return AVATARS[hash % AVATARS.length]
}

export function CanvasView({ participants }: { participants: Participant[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {participants.map((p, i) => (
        <div
          key={p.id ?? `${p.nickname}-${i}`}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'
            ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--cyan-border)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
          }}
        >
          <div style={{ fontSize: 44, lineHeight: 1 }}>{avatarFor(p.nickname)}</div>
          <div
            style={{
              color: 'var(--text-h)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {p.nickname || 'anonymous'}
          </div>

          {p.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {p.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: 'var(--cyan-dim)',
                    color: 'var(--cyan)',
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {p.looking_for_team && (
            <span
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(100, 217, 166, 0.15)',
                color: 'var(--green)',
                padding: '3px 10px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                marginTop: 'auto',
              }}
            >
              Looking for team
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export function ListView({ participants }: { participants: Participant[] }) {
  const headerStyle: React.CSSProperties = {
    textAlign: 'left',
    color: 'var(--text-h)',
    fontFamily: 'var(--font-display)',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    userSelect: 'none',
  }

  const cellStyle: React.CSSProperties = {
    padding: '14px 16px',
    color: 'var(--text-body)',
    fontSize: 14,
    verticalAlign: 'top',
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-alt)' }}>
            <th style={headerStyle}>Nickname ↕</th>
            <th style={headerStyle}>Skills ↕</th>
            <th style={headerStyle}>Status ↕</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, i) => (
            <tr
              key={p.id ?? `${p.nickname}-${i}`}
              style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-surface)' }}
            >
              <td style={{ ...cellStyle, color: 'var(--text-h)', fontWeight: 600 }}>
                <span style={{ marginRight: 8 }}>{avatarFor(p.nickname)}</span>
                {p.nickname || 'anonymous'}
              </td>
              <td style={cellStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.skills.length === 0 ? (
                    <span style={{ color: 'var(--text)' }}>—</span>
                  ) : (
                    p.skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          background: 'var(--cyan-dim)',
                          color: 'var(--cyan)',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td style={cellStyle}>
                {p.looking_for_team ? (
                  <span
                    style={{
                      background: 'rgba(100, 217, 166, 0.15)',
                      color: 'var(--green)',
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Looking for team
                  </span>
                ) : (
                  <span style={{ color: 'var(--text)' }}>On a team</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
