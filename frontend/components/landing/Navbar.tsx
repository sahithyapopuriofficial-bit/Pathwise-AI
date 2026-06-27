import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          PathWise AI
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700">
          <a href="#features" className="hover:text-blue-600">
            Features
          </a>
          <a href="#careers" className="hover:text-blue-600">
            Careers
          </a>
          <a href="#how-it-works" className="hover:text-blue-600">
            How It Works
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost">Login</Button>
          <Button>Get Started</Button>
        </div>

      </div>
    </header>
  );
}