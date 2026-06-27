import { Button } from "@/components/ui/button";
import {
  Brain,
  Database,
  Code2,
  Monitor,
  Server,
} from "lucide-react";

const careers = [
  {
    title: "AI Engineer",
    description:
      "Design intelligent applications using Machine Learning, Deep Learning, and Generative AI.",
    icon: Brain,
  },
  {
    title: "Data Scientist",
    description:
      "Extract insights from data using analytics, statistics, and predictive models.",
    icon: Database,
  },
  {
    title: "Full Stack Developer",
    description:
      "Build complete web applications using modern frontend and backend technologies.",
    icon: Code2,
  },
  {
    title: "Frontend Developer",
    description:
      "Create fast, beautiful, and responsive user interfaces with React and Next.js.",
    icon: Monitor,
  },
  {
    title: "Backend Developer",
    description:
      "Develop scalable APIs, databases, authentication, and cloud services.",
    icon: Server,
  },
];

export default function CareerRoles() {
  return (
    <section
      id="careers"
      className="bg-gradient-to-b from-slate-50 to-white py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            CAREER PATHS
          </span>

          <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900">
            Choose Your Dream Career
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-600">
            Explore high-demand technology careers and let AI build your
            personalized roadmap.
          </p>
        </div>

        {/* Career Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {careers.map((career) => {
            const Icon = career.icon;

            return (
              <div
                key={career.title}
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
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition-colors duration-300 group-hover:bg-blue-600">
                  <Icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {career.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {career.description}
                </p>

                <Button
                  className="
                    mt-8
                    w-full
                    rounded-xl
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  Explore Roadmap
                </Button>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}