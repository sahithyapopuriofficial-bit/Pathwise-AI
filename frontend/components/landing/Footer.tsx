import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              PathWise AI
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Your AI-powered career mentor helping students discover career
              paths, bridge skill gaps, and become industry-ready.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm transition-all duration-300 hover:bg-blue-600"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm transition-all duration-300 hover:bg-blue-600"
              >
                LinkedIn
              </a>

              <a
                href="mailto:support@pathwiseai.com"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm transition-all duration-300 hover:bg-blue-600"
              >
                Email
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a href="#features" className="hover:text-blue-400">
                  Features
                </a>
              </li>

              <li>
                <a href="#careers" className="hover:text-blue-400">
                  Career Paths
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="hover:text-blue-400">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/login" className="hover:text-blue-400">
                  Login
                </Link>
              </li>

              <li>
                <Link href="/signup" className="hover:text-blue-400">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Contact
            </h3>

            <p className="mt-5 text-gray-400">
              support@pathwiseai.com
            </p>

            <p className="mt-3 leading-7 text-gray-400">
              Built with ❤️ using
              <br />
              Next.js, Tailwind CSS & Supabase.
            </p>
          </div>

        </div>

        <div className="mt-14 border-t border-slate-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PathWise AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}