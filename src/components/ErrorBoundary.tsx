import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ClientFlow crashed:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleResetStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ maxWidth: 520, width: '100%', border: '1px solid var(--line)', borderRadius: 20, padding: 24, background: 'var(--panel)' }}>
            <p className="eyebrow">Oops</p>
            <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: 8 }}>Pagina nu s-a încărcat corect</h1>
            <p className="muted" style={{ marginTop: 0 }}>
              A apărut o eroare neașteptată. Încearcă mai întâi o reîncărcare.
              Dacă problema persistă, poți reseta datele locale salvate în browser.
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <button type="button" className="button" onClick={this.handleReload}>Reîncarcă pagina</button>
              <button type="button" className="button button-secondary" onClick={this.handleResetStorage}>Resetează date locale</button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
