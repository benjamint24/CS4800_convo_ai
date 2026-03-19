import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">


      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto text-center px-4 md:px-6 mt-16 md:mt-24">

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Practice Spanish with{" "}
          <span className="text-orange-500">AI Confidence</span>
        </h1>

        <p className="text-gray-600 mt-6 text-base md:text-lg leading-relaxed">
          Master real-world Spanish conversations in a judgment-free
          environment. Practice ordering at restaurants, making small talk,
          and more with AI.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <Link
            to="/register"
            className="bg-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-orange-600 shadow-md"
          >
            Start Practicing Free
          </Link>

          <Link
            to="/login"
            className="border-2 border-blue-900 text-blue-900 px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-blue-900 hover:text-white"
          >
            I Have an Account
          </Link>

        </div>

        {/* FEATURE TAGS */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">

          <span className="bg-white px-4 py-2 rounded-full shadow text-gray-600 text-sm md:text-base">
            🎯 Realistic Scenarios
          </span>

          <span className="bg-white px-4 py-2 rounded-full shadow text-gray-600 text-sm md:text-base">
            💬 Natural Conversations
          </span>

          <span className="bg-white px-4 py-2 rounded-full shadow text-gray-600 text-sm md:text-base">
            🆓 100% Free
          </span>

          <span className="bg-white px-4 py-2 rounded-full shadow text-gray-600 text-sm md:text-base">
            🚀 No Download Required
          </span>

        </div>

      </section>
    </div>
  )
}