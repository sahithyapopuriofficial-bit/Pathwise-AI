import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-blue-600"
        >
          PathWise AI
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <a
            href="#features"
            className="font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#careers"
            className="font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            Careers
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            How It Works
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="font-semibold hover:bg-blue-50 hover:text-blue-600"
            >
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="rounded-xl bg-blue-600 px-6 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}