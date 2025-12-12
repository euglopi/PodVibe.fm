import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../data/categories";
import { MediaPlayer } from "../components/MediaPlayer";

export function Player() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/browse" className="text-purple-400 hover:text-purple-300">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const currentClip = category.clips[currentClipIndex];
  const hasNext = currentClipIndex < category.clips.length - 1;
  const hasPrevious = currentClipIndex > 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-purple-400">PodVibe.fm</Link>
          <Link
            to="/browse"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-2 block">{category.icon}</span>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Clip {currentClipIndex + 1} of {category.clips.length}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Player */}
            <div>
              <MediaPlayer
                clip={currentClip}
                onNext={() => setCurrentClipIndex((i) => Math.min(i + 1, category.clips.length - 1))}
                onPrevious={() => setCurrentClipIndex((i) => Math.max(i - 1, 0))}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </div>

            {/* Clip List */}
            <div className="bg-gray-900 rounded-3xl p-6 h-fit">
              <h2 className="font-semibold text-lg mb-4">All Clips</h2>
              <div className="space-y-3">
                {category.clips.map((clip, index) => (
                  <button
                    key={clip.id}
                    onClick={() => setCurrentClipIndex(index)}
                    className={`w-full text-left p-4 rounded-xl transition-colors ${
                      index === currentClipIndex
                        ? "bg-purple-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        index === currentClipIndex ? "bg-white text-purple-600" : "bg-gray-700 text-gray-400"
                      }`}>
                        {index === currentClipIndex ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${
                          index === currentClipIndex ? "text-white" : "text-gray-200"
                        }`}>
                          {clip.title}
                        </p>
                        <p className={`text-xs truncate mt-1 ${
                          index === currentClipIndex ? "text-purple-200" : "text-gray-500"
                        }`}>
                          {clip.showTitle} &middot; {Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
