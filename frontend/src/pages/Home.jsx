import { Link } from "react-router-dom"
import useAuth from "../state/useAuth"

export default function Home() {
  const { isAuthed } = useAuth()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">

      {/* HERO SECTION - FULL WIDTH */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Practice Languages with{" "}
            <span className="text-orange-500">AI Confidence</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-10">
            Master real-world conversations in a judgment-free
            environment. Practice ordering at restaurants, asking for directions,
            making small talk, and more with AI in Spanish, English, Chinese, Korean, and Japanese.
          </p>

          {/* CTA BUTTONS - CONDITIONAL BASED ON LOGIN STATUS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isAuthed ? (
              // LOGGED IN - Show "Go to Chat" button
              <Link
                to="/chat"
                className="bg-orange-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Practicing Now →
              </Link>
            ) : (
              // NOT LOGGED IN - Show Register/Login buttons
              <>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Practicing Free
                </Link>

                <Link
                  to="/login"
                  className="border-2 border-blue-900 text-blue-900 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-900 hover:text-white transition-all"
                >
                  I Have an Account
                </Link>
              </>
            )}
          </div>

          {/* FEATURE TAGS */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 text-sm md:text-base">
              🎯 Realistic Scenarios
            </span>

            <span className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 text-sm md:text-base">
              💬 Natural Conversations
            </span>

            <span className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 text-sm md:text-base">
              🆓 100% Free
            </span>

            <span className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 text-sm md:text-base">
              🚀 No Download Required
            </span>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION - FULL WIDTH */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16 bg-white bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-6xl mb-4">🗣️</div>
              <h3 className="text-2xl font-bold mb-3">Real Conversations</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice in realistic scenarios like ordering at restaurants, asking for directions, and casual small talk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by advanced AI that responds naturally in your selected practice language.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-6xl mb-4">💯</div>
              <h3 className="text-2xl font-bold mb-3">100% Free</h3>
              <p className="text-gray-600 leading-relaxed">
                Completely free forever. No subscriptions, no hidden fees. Just unlimited language practice.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SCENARIOS PREVIEW - FULL WIDTH */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Practice Scenarios</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-8 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-6xl mb-4">🍽️</div>
              <h4 className="text-2xl font-bold mb-3">Restaurant/Café</h4>
              <p className="text-gray-700 leading-relaxed">
                Order food, ask for recommendations, and interact with a waiter in your chosen language.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-6xl mb-4">🗺️</div>
              <h4 className="text-2xl font-bold mb-3">Travel & Directions</h4>
              <p className="text-gray-700 leading-relaxed">
                Navigate a city, ask for directions, and learn practical transportation vocabulary.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-6xl mb-4">💬</div>
              <h4 className="text-2xl font-bold mb-3">Small Talk</h4>
              <p className="text-gray-700 leading-relaxed">
                Practice casual conversation about hobbies, weather, plans, and daily life.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CONVOAI - FULL WIDTH */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3xl p-10 md:p-16 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">Why ConvoAI?</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-3">✓ No Judgment</h4>
                <p className="text-blue-50 leading-relaxed">
                  Practice without fear of making mistakes. Our AI is patient and encouraging.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-3">✓ Available 24/7</h4>
                <p className="text-blue-50 leading-relaxed">
                  Practice whenever you want, as much as you want. No scheduling needed.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-3">✓ Real-World Scenarios</h4>
                <p className="text-blue-50 leading-relaxed">
                  Build language skills you'll actually use when traveling or living abroad.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-3">✓ Build Confidence</h4>
                <p className="text-blue-50 leading-relaxed">
                  Get comfortable speaking Spanish so you're ready for real conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - FULL WIDTH */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start speaking?</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            {isAuthed ? "Continue your practice" : "Join learners practicing with ConvoAI today"}
          </p>
          
          <Link
            to={isAuthed ? "/chat" : "/register"}
            className="inline-block bg-orange-500 text-white px-12 py-5 rounded-xl text-xl font-semibold hover:bg-orange-600 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            {isAuthed ? "Go to Chat →" : "Start Your First Conversation →"}
          </Link>
        </div>
      </section>

    </div>
  )
}