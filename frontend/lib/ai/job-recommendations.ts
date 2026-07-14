import { type Schema, Type } from "@google/genai";

import { getGeminiClient } from "./gemini";

export interface JobRecommendationInput {
  targetRole: string;
  assessmentScore: number;
  interviewScore: number;
  resumeScore: number;
  roadmapProgress: number;
  strongSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
}

export interface JobRecommendation {
  company: string;
  job_title: string;
  employment_type: string;
  work_mode: string;
  location: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  job_description: string;
  apply_url: string;
  source: string;
}

const recommendationFields = [
  "company",
  "job_title",
  "employment_type",
  "work_mode",
  "location",
  "match_score",
  "required_skills",
  "missing_skills",
  "job_description",
  "apply_url",
  "source",
] as const;

const jobRecommendationSchema: Schema = {
  type: Type.ARRAY,
  minItems: "6",
  maxItems: "6",
  items: {
    type: Type.OBJECT,
    required: [...recommendationFields],
    properties: {
      company: { type: Type.STRING, minLength: "1" },
      job_title: { type: Type.STRING, minLength: "1" },
      employment_type: { type: Type.STRING, minLength: "1" },
      work_mode: { type: Type.STRING, minLength: "1" },
      location: { type: Type.STRING, minLength: "1" },
      match_score: { type: Type.INTEGER, minimum: 0, maximum: 100 },
      required_skills: {
        type: Type.ARRAY,
        items: { type: Type.STRING, minLength: "1" },
      },
      missing_skills: {
        type: Type.ARRAY,
        items: { type: Type.STRING, minLength: "1" },
      },
      job_description: { type: Type.STRING, minLength: "1" },
      apply_url: { type: Type.STRING, format: "uri", minLength: "1" },
      source: { type: Type.STRING, minLength: "1" },
    },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(job: Record<string, unknown>, field: string): string {
  const value = job[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Gemini response has an invalid ${field} field.`);
  }

  return value.trim();
}

function readStringArray(job: Record<string, unknown>, field: string): string[] {
  const value = job[field];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string" && item.trim())) {
    throw new Error(`Gemini response has an invalid ${field} field.`);
  }

  return value.map((item) => item.trim());
}

function readUrl(job: Record<string, unknown>): string {
  const value = readString(job, "apply_url");

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported URL protocol.");
    }
  } catch {
    throw new Error("Gemini response has an invalid apply_url field.");
  }

  return value;
}

function parseRecommendations(text: string): JobRecommendation[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned malformed JSON.");
  }

  if (!Array.isArray(parsed) || parsed.length !== 6) {
    throw new Error("Gemini must return exactly six job recommendations.");
  }

  return parsed.map((value, index) => {
    if (!isRecord(value)) {
      throw new Error(`Gemini response item ${index + 1} is not an object.`);
    }

    const fields = Object.keys(value);
    if (
      fields.length !== recommendationFields.length ||
      !recommendationFields.every((field) => fields.includes(field))
    ) {
      throw new Error(`Gemini response item ${index + 1} does not match the required schema.`);
    }

    const score = value.match_score;
    if (
      typeof score !== "number" ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 100
    ) {
      throw new Error(`Gemini response item ${index + 1} has an invalid match_score.`);
    }

    return {
      company: readString(value, "company"),
      job_title: readString(value, "job_title"),
      employment_type: readString(value, "employment_type"),
      work_mode: readString(value, "work_mode"),
      location: readString(value, "location"),
      match_score: score,
      required_skills: readStringArray(value, "required_skills"),
      missing_skills: readStringArray(value, "missing_skills"),
      job_description: readString(value, "job_description"),
      apply_url: readUrl(value),
      source: readString(value, "source"),
    };
  });
}

function buildPrompt(input: JobRecommendationInput): string {
  return `You are an expert AI Career Coach. Recommend six realistic jobs or internships for this candidate.

Candidate details:
- Career goal: ${input.targetRole}
- Assessment score: ${input.assessmentScore}
- Interview score: ${input.interviewScore}
- Resume score: ${input.resumeScore}
- Roadmap progress: ${input.roadmapProgress}%
- Strong skills: ${input.strongSkills.join(", ") || "Not available"}
- Skills to improve: ${input.weakSkills.join(", ") || "Not available"}
- Missing skills: ${input.missingSkills.join(", ") || "Not available"}

Use the response schema to supply the recommendation data. Prefer legitimate company careers pages or established job-board URLs for apply_url.`;
}

export async function generateJobRecommendations(
  input: JobRecommendationInput
): Promise<JobRecommendation[]> {
  const prompt = buildPrompt(input);
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let rawResponse = "";

    try {
      console.info("[job-recommendations] Gemini request started", { attempt });
      const response = await getGeminiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: jobRecommendationSchema,
        },
      });

      rawResponse = response.text?.trim() ?? "";
      if (!rawResponse) {
        throw new Error("Gemini returned an empty response.");
      }

      const recommendations = parseRecommendations(rawResponse);
      console.info("[job-recommendations] Gemini response validated", {
        attempt,
        count: recommendations.length,
      });
      return recommendations;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown Gemini response error.");
      console.error("[job-recommendations] Gemini response validation failed", {
        attempt,
        error: lastError.message,
        rawResponse,
      });
    }
  }

  throw new Error(
    `Unable to generate valid job recommendations after three attempts: ${lastError?.message ?? "unknown error"}`
  );
}
