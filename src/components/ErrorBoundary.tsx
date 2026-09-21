import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches any render error in the app and shows a friendly message
 * instead of a blank white/black page. Logs full details to the console.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  private hardReset = () => {
    try {
      localStorage.removeItem('janmakundali:profile');
      localStorage.removeItem('janmakundali:guest-mode');
    } catch { /* ignore */ }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    const err = this.state.error;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-background p-6">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-700">
            Something went wrong
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-red-950">
            The page hit an error
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is usually a temporary state issue. Try one of these:
          </p>

          <pre className="mt-4 max-h-40 overflow-auto rounded-md border border-red-100 bg-red-50 p-3 text-[11px] leading-relaxed text-red-900">
            {err.message}
            {err.stack ? '\n\n' + err.stack.split('\n').slice(0, 3).join('\n') : ''}
          </pre>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={this.reset}
              className="rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50"
            >
              Try again
            </button>
            <button
              onClick={this.hardReset}
              className="rounded-md bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
            >
              Reset app data and reload
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            If the problem persists, open the browser console and share the stack trace.
          </p>
        </div>
      </div>
    );
  }
}