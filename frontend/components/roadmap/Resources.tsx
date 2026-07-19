import {
  BookOpen,
  ExternalLink,
  FileCode2,
  GitBranch,
  PlayCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "Video" | "Documentation" | "Practice" | "GitHub";
  url: string;
}

interface ResourcesProps {
  resources: Resource[];
}

function getIcon(type: Resource["type"]) {
  switch (type) {
    case "Video":
      return PlayCircle;
    case "Documentation":
      return BookOpen;
    case "Practice":
      return FileCode2;
    case "GitHub":
      return GitBranch;
    default:
      return BookOpen;
  }
}

function getBadgeColor(type: Resource["type"]) {
  switch (type) {
    case "Video":
      return "bg-red-500/10 text-red-600";

    case "Documentation":
      return "bg-blue-500/10 text-blue-600";

    case "Practice":
      return "bg-green-500/10 text-green-600";

    case "GitHub":
      return "bg-purple-500/10 text-purple-600";

    default:
      return "bg-muted";
  }
}

export default function Resources({
  resources,
}: ResourcesProps) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Learning Resources
        </h2>

        <p className="text-muted-foreground">
          Carefully selected resources to help you complete your roadmap faster.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {resources.map((resource) => {

          const Icon = getIcon(resource.type);

          return (
            <Card
              key={resource.id}
              className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <CardHeader>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">

                      <Icon className="h-6 w-6 text-primary" />

                    </div>

                    <div>

                      <CardTitle className="text-lg">
                        {resource.title}
                      </CardTitle>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {resource.description}
                      </p>

                    </div>

                  </div>

                </div>

              </CardHeader>

              <CardContent>

                <div className="flex items-center justify-between">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeColor(
                      resource.type
                    )}`}
                  >
                    {resource.type}
                  </span>

                  <Button
                    asChild
                    variant="outline"
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open

                      <ExternalLink className="ml-2 h-4 w-4" />

                    </a>
                  </Button>

                </div>

              </CardContent>

            </Card>
          );

        })}

      </div>

    </section>
  );
}