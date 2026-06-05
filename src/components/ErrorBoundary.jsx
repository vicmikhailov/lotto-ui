import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-background p-6">
          <div className="max-w-lg w-full rounded-xl border border-destructive/25 bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M2 12h20" />
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
                <p className="text-sm text-muted-foreground">An unexpected error occurred</p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 rounded-lg bg-destructive/5 p-4">
                <h2 className="mb-2 text-sm font-semibold text-destructive-foreground">Error:</h2>
                <p className="text-sm text-destructive-foreground/80 font-mono break-all">
                  {String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = window.location.origin + window.location.pathname)}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
