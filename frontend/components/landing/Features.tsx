import {
  Brain,
  Target,
  BarChart3,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Career Roadmap",
    description:
      "Receive a personalized roadmap tailored to your career goals.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and know exactly what to learn next.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track your learning journey with milestones and achievements.",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description:
      "Get curated courses, tutorials, and practice resources.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Why Choose PathWise AI?
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need to plan, learn, and grow your career.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <Icon className="mb-5 h-10 w-10 text-blue-600" />

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}