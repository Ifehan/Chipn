/**
 * Lazy Loading Helper
 * Utilities for lazy loading components and pages to improve initial bundle size
 *
 * Usage:
 * import { lazyComponent } from './utils/lazy-loading'
 * const HomePage = lazyComponent(() => import('./pages/HomePage'))
 */

import type { ComponentType } from 'react';
import React, { Suspense, lazy as reactLazy } from 'react'

interface LazyComponentProps {
  loading?: React.ReactNode
  error?: React.ReactNode
}

/**
 * Wrapper for React.lazy with error boundary and loading fallback
 * @param importFunc - Dynamic import function
 * @param options - Configuration options
 * @returns Memoized lazy component with Suspense wrapper
 */
export function lazyComponent<P extends React.JSX.IntrinsicAttributes>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: LazyComponentProps
) {
  const LazyComponent = reactLazy(importFunc)
  const FallbackComponent = options?.loading || <LoadingFallback />
  const ErrorComponent = options?.error || <ErrorFallback />

  const WrappedComponent = React.memo((props: P) => (
    <Suspense fallback={FallbackComponent}>
      <ErrorBoundary fallback={ErrorComponent}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LazyComponent {...(props as any)} />
      </ErrorBoundary>
    </Suspense>
  ))

  WrappedComponent.displayName = `Lazy(${
    (LazyComponent as unknown as { displayName?: string }).displayName || 'Component'
  })`

  return WrappedComponent
}

/**
 * Default loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )
}

/**
 * Default error fallback component
 */
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600">Please refresh the page and try again.</p>
      </div>
    </div>
  )
}

/**
 * Simple Error Boundary component
 */
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

/**
 * For future use: Configuration for which pages should be lazy loaded
 * Uncomment and use in your router configuration:
 *
 * const HomePage = lazyComponent(() => import('./pages/HomePage'))
 * const LoginPage = lazyComponent(() => import('./pages/LoginPage'))
 * const SignupPage = lazyComponent(() => import('./pages/SignupPage'))
 * const UserManagementPage = lazyComponent(() => import('./pages/UserManagementPage'))
 * const VendorsPage = lazyComponent(() => import('./pages/VendorsPage'))
 * const AdminDashboard = lazyComponent(() => import('./pages/AdminDashboard'))
 * const TransactionsManagementPage = lazyComponent(() => import('./pages/TransactionsManagementPage'))
 * const TransactionHistoryPage = lazyComponent(() => import('./pages/TransactionHistoryPage'))
 * const ProfileSettingsPage = lazyComponent(() => import('./pages/ProfileSettingsPage'))
 * const CreateNewBillPage = lazyComponent(() => import('./pages/CreateNewBillPage'))
 *
 * Then use in your router:
 * {
 *   path: '/home',
 *   element: <HomePage />
 * },
 * {
 *   path: '/admin',
 *   element: <AdminDashboard />
 * },
 * // etc...
 */
