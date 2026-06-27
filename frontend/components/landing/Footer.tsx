import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              PathWise AI
            </h2>

            <p className="mt-4 text-sm">
              Your AI-powered career mentor helping students discover the
              right career path and build future-ready skills.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white">
              Platform
            </h3>

            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#features">Features</a></li>
              <li><a href="#careers">Career Paths</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white">
              Account
            </h3>

            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/login">Login</Link>
              </li>

              <li>
                <Link href="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">
              Contact
            </h3>

            <p className="mt-4 text-sm">
              support@pathwiseai.com
            </p>

            <p className="mt-2 text-sm">
              Built with ❤️ using Next.js & Supabase
            </p>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PathWise AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}