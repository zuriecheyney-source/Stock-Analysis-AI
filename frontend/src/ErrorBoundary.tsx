import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
  stackTrace: string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    stackTrace: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Unknown error',
      stackTrace: error.stack || ''
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error boundary caught an error:', error, errorInfo);
    this.setState({
      stackTrace: errorInfo.componentStack || error.stack || ''
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-3">页面渲染出错</h1>
            <p className="text-gray-700 mb-4">
              点击按钮后页面出现空白，说明前端渲染发生了异常。现在已经捕获到错误，方便继续定位。
            </p>
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 whitespace-pre-wrap">
              {this.state.errorMessage}
            </div>
            {this.state.stackTrace && (
              <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-5 text-gray-100 whitespace-pre-wrap">
                {this.state.stackTrace}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}