import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-32">
      {/* Decorative Background */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"></div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center">

        {/* Badge */}
        <span className="mb-6 rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm">
          🚀 AI-Powered Career Guidance
        </span>

        {/* Heading */}
        <h1 className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl">
          Discover Your Perfect Career with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PathWise AI
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-600">
          Get personalized career recommendations, identify skill gaps, and
          follow AI-generated learning roadmaps to become industry-ready.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-xl bg-blue-600 px-8 py-6 text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              Get Started Free
            </Button>
          </Link>

          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-8 rounded-3xl border border-white/50 bg-white/80 p-10 shadow-xl backdrop-blur md:grid-cols-3">

          <div>
            <h2 className="text-4xl font-extrabold text-blue-600">5+</h2>
            <p className="mt-2 text-gray-600">Career Paths</p>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold text-blue-600">100+</h2>
            <p className="mt-2 text-gray-600">Skills Mapped</p>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold text-blue-600">AI</h2>
            <p className="mt-2 text-gray-600">Personalized Guidance</p>
          </div>

        </div>
      </div>
    </section>
  );
}