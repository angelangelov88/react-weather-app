import { Component, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app cold">
          <main>
            <div id="initialMessage">
              <p>Something went wrong. Please refresh the page and try again.</p>
            </div>
          </main>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
