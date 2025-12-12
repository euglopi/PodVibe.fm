import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-purple-600">PodVibe.fm</Link>
          <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Skip the fluff.
            <br />
            <span className="text-purple-600">Get the wisdom.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            AI-powered podcast insights. We extract the 20% that matters and deliver it in bite-sized clips you can actually use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
              Join the Waitlist
            </button>
            <Link
              to="/browse"
              className="px-8 py-4 text-gray-700 font-medium rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">The Problem</div>
              <h2 className="text-2xl font-semibold mb-4">Podcasts are long. Your time isn't.</h2>
              <p className="text-gray-600">
                The average podcast is 90 minutes. The valuable insights? Maybe 15 minutes scattered throughout. You don't have time to hunt for gold in every episode.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-3">The Solution</div>
              <h2 className="text-2xl font-semibold mb-4">AI that listens so you don't have to.</h2>
              <p className="text-gray-600">
                PodVibe extracts the key insights, timestamps them, and delivers them as clips. Ask a question, get the answer. Like having a research assistant for every podcast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600">Three steps to podcast enlightenment</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Upload or paste</h3>
              <p className="text-gray-600 text-sm">Drop in a podcast episode URL or upload an audio file. We handle the rest.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">AI extracts insights</h3>
              <p className="text-gray-600 text-sm">Our AI identifies key moments, ranks them by value, and maps them to precise timestamps.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Listen to clips</h3>
              <p className="text-gray-600 text-sm">Get TikTok-length wisdom drops. Search, browse, or let our guide recommend what's next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Insight Card */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What an insight looks like</h2>
            <p className="text-gray-600">Structured knowledge, ready to use</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-purple-700 transition-colors">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <div>
                <div className="text-xs text-gray-500 mb-1">12:34 - 13:21 &middot; The Tim Ferriss Show</div>
                <h3 className="font-semibold text-lg">The best investments are often the ones you say no to.</h3>
              </div>
            </div>
            <blockquote className="border-l-4 border-purple-200 pl-4 text-gray-600 italic mb-6">
              "I've found that 90% of my returns came from 10% of my investments. But more importantly, 90% of my peace of mind came from the 100 deals I turned down."
            </blockquote>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">investing</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">tactical</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">contrarian</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <div>
                <span className="font-medium text-gray-700">0.9</span> actionable
              </div>
              <div>
                <span className="font-medium text-gray-700">0.8</span> novel
              </div>
              <div>
                <span className="font-medium text-gray-700">0.95</span> clipable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for how you learn</h2>
            <p className="text-gray-600">Features that make podcast wisdom accessible</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Voice search</h3>
              <p className="text-gray-600 text-sm">"What did they say about raising a Series A?" Ask naturally, get clips.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Smart boundaries</h3>
              <p className="text-gray-600 text-sm">Clips start and end at natural breaks. No awkward cuts or missing context.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Podcast DJ</h3>
              <p className="text-gray-600 text-sm">After each clip, your guide recommends what to explore next based on your interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to skip the fluff?</h2>
          <p className="text-gray-400 mb-8">Join the waitlist for early access. We're launching soon.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button className="px-8 py-4 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors whitespace-nowrap">
              Get Early Access
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">No spam. We'll only email you when we launch.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            &copy; 2024 PodVibe.fm. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
