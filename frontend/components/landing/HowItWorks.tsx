import { Search, Brain, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Take a Skill Assessment",
    description:
      "Answer a few questions about your interests, skills, and career goals so our AI understands your profile.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analyzes Your Skills",
    description:
      "PathWise AI compares your current abilities with industry requirements and identifies skill gaps.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Follow Your Roadmap",
    description:
      "Receive a personalized roadmap with courses, projects, and milestones to achieve your dream career.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-white to-slate-50 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            HOW IT WORKS
          </span>

          <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900">
            Start Your Career Journey in 3 Steps
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-600">
            PathWise AI makes career planning simple with AI-powered guidance,
            personalized recommendations, and continuous progress tracking.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Step Number */}
                <span className="absolute right-6 top-6 text-5xl font-extrabold text-slate-100 transition-colors duration-300 group-hover:text-blue-100">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition-colors duration-300 group-hover:bg-blue-600">
                  <Icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}