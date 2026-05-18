import { Nav } from './Nav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)' }}>
      <Nav />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)', marginTop: '80px',
        padding: '40px 32px', textAlign: 'center',
        color: 'var(--text)', fontSize: '14px',
      }}>
        <p>
          Built with the{' '}
          <a href="https://infrared.city" target="_blank" rel="noreferrer">infrared.city</a>
          {' '}SDK ·{' '}
          <a href="https://pypi.org/project/infrared-sdk/" target="_blank" rel="noreferrer">pip install infrared-sdk</a>
        </p>
      </footer>
    </div>
  )
}
