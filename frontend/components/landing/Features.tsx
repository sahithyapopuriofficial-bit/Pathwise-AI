import { Brain, Target, BarChart3, BookOpen } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Career Roadmap",
    description:
      "Generate a personalized learning roadmap tailored to your dream career.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "Instantly discover the skills you need to become industry-ready.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track milestones, completed skills, and overall career progress.",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description:
      "Access curated courses, tutorials, and projects recommended by AI.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-white to-slate-50 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            FEATURES
          </span>

          <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900">
            Everything You Need to Grow
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-600">
            PathWise AI combines artificial intelligence, career guidance,
            and personalized learning into one powerful platform.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-8
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                "
              >
                <div
                  className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100
                    transition-colors
                    duration-300
                    group-hover:bg-blue-600
                  "
                >
                  <Icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
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