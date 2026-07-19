import { getGeminiClient } from "./gemini";

export type RecommendationPriority = "High" | "Medium" | "Low";

export interface RoadmapTask {
  title: string;
  description: string;
  estimatedMinutes: number;
  xp: number;
  completed: boolean;
}

export interface RoadmapRecommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  difficulty: string;
  estimatedHours: number;
  skills: string[];
  tasks: RoadmapTask[];
  resources: string[];
  project: string;
}

export interface RoadmapResult {
  title: string;
  estimated_duration: number;
  xp: {
    current: number;
    nextLevel: number;
    level: number;
  };
  statistics: {
    totalSkills: number;
    studyHours: number;
    projects: number;
  };
  recommendations: RoadmapRecommendation[];
  milestones: RoadmapMilestone[];
  weeks: RoadmapWeek[];
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function priorityValue(value: unknown): RecommendationPriority {
  const normalized = stringValue(value, "Medium").toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";
  return "Medium";
}

function normalizeTask(value: unknown, week: number, index: number): RoadmapTask {
  const task = isRecord(value) ? value : {};

  return {
    title: stringValue(task.title, `Week ${week} learning task ${index + 1}`),
    description: stringValue(task.description, "Complete the planned learning activity."),
    estimatedMinutes: numberValue(task.estimatedMinutes ?? task.duration, 60),
    xp: numberValue(task.xp, 25),
    completed: task.completed === true,
  };
}

/** Normalizes persisted legacy plans as well as Gemini's JSON response. */
export function normalizeRoadmap(value: unknown): RoadmapResult {
  if (!isRecord(value)) {
    throw new Error("The AI returned an invalid roadmap response.");
  }

  const rawWeeks = Array.isArray(value.weeks) ? value.weeks : [];
  if (rawWeeks.length === 0) {
    throw new Error("The AI roadmap did not include any weekly learning plans.");
  }

  const weeks = rawWeeks.map((value, index) => {
    const week = isRecord(value) ? value : {};
    const weekNumber = numberValue(week.week, index + 1) || index + 1;
    const tasks = Array.isArray(week.tasks)
      ? week.tasks.map((task, taskIndex) => normalizeTask(task, weekNumber, taskIndex))
      : [];

    return {
      week: weekNumber,
      title: stringValue(week.title, `Week ${weekNumber}`),
      difficulty: stringValue(week.difficulty, "Intermediate"),
      estimatedHours: numberValue(week.estimatedHours, 0),
      skills: stringList(week.skills),
      tasks,
      resources: stringList(week.resources),
      project: stringValue(week.project, "Apply this week's skills in a practical project."),
    };
  });

  const xp = isRecord(value.xp) ? value.xp : {};
  const statistics = isRecord(value.statistics) ? value.statistics : {};
  const rawRecommendations = Array.isArray(value.recommendations)
    ? value.recommendations
    : [];
  const rawMilestones = Array.isArray(value.milestones) ? value.milestones : [];

  return {
    title: stringValue(value.title, "Personalized Learning Roadmap"),
    estimated_duration: numberValue(value.estimated_duration, weeks.length) || weeks.length,
    xp: {
      current: numberValue(xp.current),
      nextLevel: numberValue(xp.nextLevel, 100),
      level: Math.max(1, numberValue(xp.level, 1)),
    },
    statistics: {
      totalSkills: numberValue(statistics.totalSkills),
      studyHours: numberValue(statistics.studyHours),
      projects: numberValue(statistics.projects),
    },
    recommendations: rawRecommendations.map((value, index) => {
      const recommendation = isRecord(value) ? value : {};
      return {
        id: stringValue(recommendation.id, `recommendation-${index + 1}`),
        title: stringValue(recommendation.title, "Continue your learning plan"),
        description: stringValue(
          recommendation.description,
          "Focus on the next planned learning activity to maintain momentum.",
        ),
        priority: priorityValue(recommendation.priority),
        category: stringValue(recommendation.category, "Learning"),
      };
    }),
    milestones: rawMilestones.map((value, index) => {
      const milestone = isRecord(value) ? value : {};
      return {
        id: stringValue(milestone.id, `milestone-${index + 1}`),
        title: stringValue(milestone.title, `Milestone ${index + 1}`),
        description: stringValue(milestone.description, "Complete roadmap activities to unlock this milestone."),
        reward: stringValue(milestone.reward, "Achievement unlocked"),
        completed: milestone.completed === true,
      };
    }),
    weeks,
  };
}

function parseRoadmapResponse(responseText: string): RoadmapResult {
  const trimmed = responseText.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start < 0 || end < start) {
    throw new Error("The AI returned an invalid roadmap response.");
  }

  try {
    return normalizeRoadmap(JSON.parse(trimmed.slice(start, end + 1)));
  } catch {
    throw new Error("The AI roadmap could not be parsed. Please try generating it again.");
  }
}

export async function generateRoadmap(
  targetRole: string,
  weakSkills: string[],
  missingSkills: string[],
): Promise<RoadmapResult> {
  const prompt = `You are an expert AI Career Mentor. Generate a complete personalized learning roadmap for a professional ${targetRole}.

Target role: ${targetRole}
Weak skills: ${weakSkills.length ? weakSkills.join(", ") : "None provided"}
Missing skills: ${missingSkills.length ? missingSkills.join(", ") : "None provided"}

Prioritize missing skills before weak skills. Create practical, sequenced weekly milestones with realistic study time. Return ONLY one valid JSON object—no markdown, commentary, or code fences.

The JSON must exactly contain this structure:
{
  "title": "string",
  "estimated_duration": 12,
  "xp": { "current": 0, "nextLevel": 500, "level": 1 },
  "statistics": { "totalSkills": 0, "studyHours": 0, "projects": 0 },
  "recommendations": [{ "id": "string", "title": "string", "description": "string", "priority": "High|Medium|Low", "category": "Learning|Career|Resume|AI" }],
  "milestones": [{ "id": "string", "title": "string", "description": "string", "reward": "string", "completed": false }],
  "weeks": [{
    "week": 1,
    "title": "string",
    "difficulty": "Beginner|Intermediate|Advanced",
    "estimatedHours": 8,
    "skills": ["string"],
    "tasks": [{ "title": "string", "description": "string", "estimatedMinutes": 60, "xp": 25, "completed": false }],
    "resources": ["string"],
    "project": "string"
  }]
}

Include at least one recommendation, milestone, task, and resource for every applicable learning phase. All generated tasks and milestones must start with completed set to false.`;

  const response = await getGeminiClient().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return parseRoadmapResponse(response.text ?? "");
}
