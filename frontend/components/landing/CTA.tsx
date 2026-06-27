import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700"></div>

      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-5xl px-6 text-center text-white">

        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          START YOUR JOURNEY TODAY
        </span>

        <h2 className="mt-8 text-5xl font-extrabold tracking-tight md:text-6xl">
          Ready to Build Your Dream Career?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-blue-100">
          Discover your ideal career path, identify skill gaps, and receive a
          personalized AI-powered roadmap designed to help you succeed.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-xl bg-white px-8 py-6 text-lg font-semibold text-blue-700 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-white px-8 py-6 text-lg text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-700"
            >
              Login
            </Button>
          </Link>

        </div>

      </div>
    </section>
  );
}