import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
    <h1 className="mb-4 text-9xl font-bold text-gray-300 dark:text-gray-700">
      404
    </h1>
    <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
      Page Not Found
    </h2>
    <p className="mb-6 text-gray-600 dark:text-gray-400">
      The page you're looking for doesn't exist.
    </p>
    <Link
      to="/"
      className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
    >
      Go Home
    </Link>
  </div>
);
