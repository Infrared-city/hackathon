import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',             label: 'Hackathon' },
  { to: '/participants', label: 'Participants' },
  { to: '/projects',     label: 'Projects' },
]

export function Nav() {
  const { pathname } = useLocation()

  return (
    <nav className="site-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(9,28,31,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '64px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-h)', fontSize: '1rem' }}>
          infrared<span style={{ color: 'var(--cyan)' }}>.city</span>
        </span>
        <span style={{
          background: 'var(--cyan-dim)', border: '1px solid var(--cyan-border)',
          color: 'var(--cyan)', fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
          fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}>HACKATHON</span>
      </Link>

      <div className="site-nav-links" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className="site-nav-link" style={{
            padding: '6px 16px', borderRadius: 6, fontSize: '14px', fontWeight: 500,
            color: pathname === l.to ? 'var(--cyan)' : 'var(--text)',
            background: pathname === l.to ? 'var(--cyan-dim)' : 'transparent',
            textDecoration: 'none', transition: 'all 0.15s',
          }}>{l.label}</Link>
        ))}
        <Link to="/get-key" className="btn-primary site-nav-cta" style={{ padding: '8px 20px', fontSize: '14px' }}>
          Get API Key
        </Link>
      </div>
    </nav>
  )
}
