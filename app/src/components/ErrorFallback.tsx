interface ErrorFallbackProps {
  error: Error;
}

export const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <h1 className="mb-4 text-6xl font-bold text-red-600">Oops!</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
      >
        Reload Page
      </button>
    </div>
  </div>
);
