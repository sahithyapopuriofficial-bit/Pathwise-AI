import { Search, Brain, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Take Assessment",
    description:
      "Complete a quick skill assessment to evaluate your current knowledge.",
  },
  {
    icon: Brain,
    title: "2. AI Analysis",
    description:
      "Our AI identifies your strengths, weaknesses, and skill gaps.",
  },
  {
    icon: Rocket,
    title: "3. Personalized Roadmap",
    description:
      "Receive a customized learning roadmap to achieve your dream career.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-blue-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            How PathWise AI Works
          </h2>

          <p className="mt-4 text-gray-600">
            Three simple steps to accelerate your career journey.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-xl bg-white p-8 text-center shadow-sm"
              >
                <Icon className="mx-auto mb-6 h-12 w-12 text-blue-600" />

                <h3 className="text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 text-gray-600">
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