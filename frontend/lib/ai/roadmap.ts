import { ai } from "./gemini";

export interface RoadmapWeek {
  week: number;
  title: string;
  skills: string[];
  resources: string[];
  project: string;
}

export interface RoadmapResult {
  title: string;
  estimated_duration: number;
  weeks: RoadmapWeek[];
}

export async function generateRoadmap(
  targetRole: string,
  weakSkills: string[],
  missingSkills: string[]
): Promise<RoadmapResult> {
  const prompt = `
You are an expert AI Career Mentor.

Generate a personalized weekly learning roadmap.

Target Role:
${targetRole}

Weak Skills:
${weakSkills.length ? weakSkills.join(", ") : "None"}

Missing Skills:
${missingSkills.length ? missingSkills.join(", ") : "None"}

Instructions:

1. Create a roadmap specifically for becoming a professional ${targetRole}.

2. Prioritize Missing Skills first.

3. Then improve Weak Skills.

4. Divide the roadmap into weekly milestones.

5. Every week must contain:

- Week Number
- Title
- Skills to Learn
- Best Learning Resources
- One Practical Project

6. Estimate the total duration in weeks.

Return ONLY valid JSON.

The JSON format MUST be:

{
  "title":"Frontend Developer Roadmap",
  "estimated_duration":12,
  "weeks":[
    {
      "week":1,
      "title":"HTML Fundamentals",
      "skills":[
        "HTML5",
        "Semantic HTML"
      ],
      "resources":[
        "MDN HTML",
        "freeCodeCamp HTML"
      ],
      "project":"Build a Personal Portfolio Landing Page"
    }
  ]
}

Do NOT return markdown.

Do NOT explain anything.

Return ONLY JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Gemini Roadmap Response:");
    console.error(cleaned);

    throw new Error("Failed to parse AI roadmap.");
  }
}