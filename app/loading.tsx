export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="hidden sm:block w-48 h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Search Bar Skeleton */}
        <div className="mb-6 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
