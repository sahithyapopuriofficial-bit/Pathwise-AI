import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Build Your Dream Career?
        </h2>

        <p className="mt-6 text-lg text-blue-100">
          Join thousands of students using PathWise AI to discover career paths,
          identify skill gaps, and achieve their goals faster.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}