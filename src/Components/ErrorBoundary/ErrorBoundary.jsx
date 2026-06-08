import { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleRetry,
        });
      }

      return (
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-display font-semibold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {this.props.message ||
                "An unexpected error occurred. You can try again or reload the page."}
            </p>
            {import.meta.env.DEV && this.state.error?.message && (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-gray-50 p-3 text-left text-xs text-red-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="btn btn-primary px-4 py-2"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-secondary px-4 py-2"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onReset: PropTypes.func,
};

export default ErrorBoundary;
