import React from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <h3>Something went wrong...</h3>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export function WithErrorBoundary<P extends object>(
  BaseComponent: React.ComponentType<P>,
) {
  const component = (props: P) => {
    return (
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <BaseComponent {...props} />
      </ErrorBoundary>
    )
  }

  return component
}

export default WithErrorBoundary
