import { getGeminiClient } from "./gemini";

type ResumeAnalysisInput =
  | string
  | { kind: "text"; text: string }
  | { kind: "file"; file: Blob; mimeType: string };

export interface ResumeAnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  summary: string;
  extracted_skills: string[];
}

export async function analyzeResume(
  resumeInput: ResumeAnalysisInput,
  targetRole: string,
  requiredSkills: string[]
): Promise<ResumeAnalysisResult> {
  const ai = getGeminiClient();

  const resumeText =
    typeof resumeInput === "string"
      ? resumeInput
      : resumeInput.kind === "text"
      ? resumeInput.text
      : "";

  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume for the role:

${targetRole}

Required Skills:
${requiredSkills.join(", ")}

Resume:

${resumeText}

Return ONLY valid JSON.

{
  "ats_score": 85,
  "strengths": [
    "Strong React knowledge",
    "Good frontend experience"
  ],
  "missing_skills": [
    "Docker",
    "CI/CD"
  ],
  "improvements": [
    "Add measurable achievements",
    "Improve project descriptions"
  ],
  "summary": "Overall the resume is good but needs stronger cloud experience.",
  "extracted_skills": [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Git"
  ]
}

Rules:
- Return JSON only.
- No markdown.
- No explanation.
- extracted_skills should only contain technical skills.
`;

  let contents:
    | string
    | Array<{
        role: "user";
        parts: Array<
          | { text: string }
          | {
              fileData: {
                fileUri: string;
                mimeType: string;
              };
            }
        >;
      }> = prompt;

  if (
    typeof resumeInput !== "string" &&
    resumeInput.kind === "file"
  ) {
    const uploadedFile = await ai.files.upload({
      file: resumeInput.file,
      config: {
        mimeType: resumeInput.mimeType,
      },
    });

    contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
          {
            fileData: {
              fileUri: uploadedFile.uri ?? "",
              mimeType: resumeInput.mimeType,
            },
          },
        ],
      },
    ];
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = (response.text ?? "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    console.error("Gemini Response:", text);
    throw new Error("Failed to parse Gemini JSON response.");
  }

  const data = parsed as Partial<ResumeAnalysisResult>;

  return {
    ats_score:
      typeof data.ats_score === "number"
        ? data.ats_score
        : 0,

    strengths: Array.isArray(data.strengths)
      ? data.strengths.filter(
          (v): v is string => typeof v === "string"
        )
      : [],

    missing_skills: Array.isArray(data.missing_skills)
      ? data.missing_skills.filter(
          (v): v is string => typeof v === "string"
        )
      : [],

    improvements: Array.isArray(data.improvements)
      ? data.improvements.filter(
          (v): v is string => typeof v === "string"
        )
      : [],

    summary:
      typeof data.summary === "string"
        ? data.summary
        : "",

    extracted_skills: Array.isArray(data.extracted_skills)
      ? data.extracted_skills.filter(
          (v): v is string => typeof v === "string"
        )
      : [],
  };
}