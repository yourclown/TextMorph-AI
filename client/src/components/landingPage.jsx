import { Link } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Footer";

const Landing = () => {
  useEffect(() => {
    document.title = "StoryForge AI | Create Magic with Words";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 4}px`,
              height: `${Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 animate-gradient-x">
            Craft Stories with AI Magic
          </h1>
          <p className="text-xl text-cyan-200/80 font-mono mb-8">
            Transform your ideas into captivating 100-word masterpieces in
            seconds
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-8 py-3.5 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 hover:scale-105 transition-all shadow-glow-cyan"
            >
              Start Creating Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 border border-blue-400 rounded-lg font-bold text-blue-400 hover:bg-blue-400/10 hover:scale-105 transition-all"
            >
              Existing User
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all">
            <div className="text-cyan-400 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              Instant Generation
            </h3>
            <p className="text-cyan-200/80 font-mono text-sm">
              Create unique stories in under 10 seconds using our advanced AI
              engine
            </p>
          </div>

          <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all">
            <div className="text-blue-400 text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">
              Multiple Genres
            </h3>
            <p className="text-cyan-200/80 font-mono text-sm">
              Choose from Horror, Romance, Sci-Fi, and more. Your imagination's
              the limit
            </p>
          </div>

          <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all">
            <div className="text-purple-400 text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">
              Secure Archive
            </h3>
            <p className="text-cyan-200/80 font-mono text-sm">
              All your stories are safely stored and accessible anytime
            </p>
          </div>
        </div>

        {/* Live Demo Preview */}
        <div className="mb-20 p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                See it in Action
              </h2>
              <div className="font-mono text-cyan-200/80 mb-6">
                <span className="text-cyan-400">$</span> generate-story --genre
                sci-fi --theme "space adventure"
              </div>
              <div className="p-4 bg-black/50 rounded-lg border border-cyan-400/10">
                <p className="text-cyan-300 text-sm animate-pulse">
                  Generating story about interstellar explorers...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-cyan-400 mb-2">
            Unlimited Creativity
          </h2>
          <p className="text-cyan-200/80 font-mono mb-8">
            Just $1 for 3 story credits - Less than a coffee for endless
            inspiration
          </p>
          <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl animate-gradient-x">
            <div className="bg-gray-900 rounded-lg p-8">
              <div className="text-5xl font-bold text-cyan-400 mb-2">$1</div>
              <div className="text-cyan-200/80 font-mono mb-6">
                3 Story Credits
              </div>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md text-gray-900 font-bold hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
