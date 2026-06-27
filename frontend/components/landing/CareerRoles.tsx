import { Button } from "@/components/ui/button";

const careers = [
  {
    title: "AI Engineer",
    description: "Build intelligent systems using machine learning and AI technologies.",
  },
  {
    title: "Data Scientist",
    description: "Analyze data to uncover insights and drive business decisions.",
  },
  {
    title: "Full Stack Developer",
    description: "Develop complete web applications from frontend to backend.",
  },
  {
    title: "Frontend Developer",
    description: "Create beautiful, responsive, and interactive user interfaces.",
  },
  {
    title: "Backend Developer",
    description: "Design APIs, databases, and server-side application logic.",
  },
];

export default function CareerRoles() {
  return (
    <section id="careers" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Explore Career Paths
          </h2>

          <p className="mt-4 text-gray-600">
            Choose your desired career and let PathWise AI create a personalized roadmap.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career) => (
            <div
              key={career.title}
              className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <h3 className="text-2xl font-semibold">
                {career.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {career.description}
              </p>

              <Button className="mt-6 w-full">
                View Roadmap
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}