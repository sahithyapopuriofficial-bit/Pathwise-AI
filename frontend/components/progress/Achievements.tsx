import {
  Award,
  BadgeCheck,
  Brain,
  Crown,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AchievementsProps {
  achievements: string[];
}

const achievementMap: Record<
  string,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bg: string;
  }
> = {
  "ATS Score 80+": {
    title: "ATS Expert",
    description: "Scored above 80 in Resume ATS.",
    icon: BadgeCheck,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },

  "Completed 4 Roadmap Weeks": {
    title: "Roadmap Explorer",
    description: "Completed four roadmap milestones.",
    icon: Award,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },

  "AI Mentor Explorer": {
    title: "AI Explorer",
    description: "Had 10+ AI mentor conversations.",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },

  "Interview Master": {
    title: "Interview Master",
    description: "Achieved 85+ interview score.",
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },

  "Career Ready": {
    title: "Career Ready",
    description: "Reached 75% career readiness.",
    icon: Crown,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
};

export default function Achievements({
  achievements,
}: AchievementsProps) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Achievements
        </h2>

        <p className="text-muted-foreground">
          Milestones you&apos;ve unlocked throughout your journey.
        </p>

      </div>

      {achievements.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">

          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-xl font-semibold">
            No Achievements Yet
          </h3>

          <p className="mt-2 text-muted-foreground">
            Continue learning to unlock badges.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {achievements.map((achievement) => {
            const item = achievementMap[achievement];

            if (!item) return null;

            const Icon = item.icon;

            return (
              <div
                key={achievement}
                className="group overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <Icon
                      className={`h-7 w-7 ${item.color}`}
                    />
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Unlocked
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
