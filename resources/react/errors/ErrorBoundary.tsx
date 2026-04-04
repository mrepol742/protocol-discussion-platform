import React, { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold mb-4">An error occurred</h1>
                        <p className="text-lg text-gray-600">{this.state.error?.message}</p>
                        <small className="text-gray-400 block mt-2 mx-2">
                            Please try refreshing the page or contact support if the issue persists.
                        </small>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
