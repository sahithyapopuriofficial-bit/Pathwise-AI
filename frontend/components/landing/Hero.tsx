import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          🚀 AI-Powered Career Guidance
        </span>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl">
          Build Your Dream Career with{" "}
          <span className="text-blue-600">PathWise AI</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Discover your ideal career path, identify skill gaps, and receive a
          personalized AI-powered learning roadmap designed just for you.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-600">5+</h2>
            <p className="text-gray-600">Career Paths</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-blue-600">100+</h2>
            <p className="text-gray-600">Skills Mapped</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-blue-600">AI</h2>
            <p className="text-gray-600">Personalized Guidance</p>
          </div>
        </div>
      </div>
    </section>
  );
}