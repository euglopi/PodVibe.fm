import { Link } from "react-router-dom";
import { categories } from "../data/categories";

export function Browse() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-purple-600">PodVibe.fm</Link>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Browse by Category</h1>
          <p className="text-gray-600">Explore insights from 12 podcast categories. Tap to listen.</p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/player/${category.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h2>
                </div>

                {/* Show Thumbnails */}
                <div className="flex gap-2 mb-3">
                  {category.shows.map((show) => (
                    <div
                      key={show.id}
                      className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    >
                      {category.icon}
                    </div>
                  ))}
                </div>

                {/* Show Titles */}
                <div className="space-y-1">
                  {category.shows.map((show) => (
                    <p key={show.id} className="text-xs text-gray-500 truncate">
                      {show.title}
                    </p>
                  ))}
                </div>

                {/* Clip Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-purple-600 font-medium">
                    {category.clips.length} clips available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
