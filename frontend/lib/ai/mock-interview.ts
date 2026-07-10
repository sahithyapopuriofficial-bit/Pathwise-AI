import { ai } from "./gemini";

export interface MockInterviewContext {
  targetRole: string;
  assessmentScore: number;
  strongSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
  resumeSummary: string;
}

export interface InterviewQuestion {
  question: string;
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  ideal_answer: string;
}

export interface InterviewSummary {
  overall_feedback: string;
  recommendations: string[];
}

// ----------------------------
// Generate Interview Questions
// ----------------------------

export async function generateInterviewQuestions(
  context: MockInterviewContext,
  difficulty: string,
  interviewType: string
): Promise<InterviewQuestion[]> {
  const prompt = `
You are an experienced technical interviewer.

Candidate Information

Target Role:
${context.targetRole}

Assessment Score:
${context.assessmentScore}

Strong Skills:
${context.strongSkills.join(", ")}

Weak Skills:
${context.weakSkills.join(", ")}

Missing Skills:
${context.missingSkills.join(", ")}

Resume Summary:
${context.resumeSummary}

Generate exactly 10 interview questions.

Difficulty:
${difficulty}

Interview Type:
${interviewType}

Return ONLY valid JSON.

[
  {
    "question":"..."
  },
  {
    "question":"..."
  }
]

No markdown.
No explanation.
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
  } catch (error) {
    console.error("Question Generation Error");
    console.error(text);

    return [];
  }
}

// ----------------------------
// Evaluate Individual Answer
// ----------------------------

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<InterviewEvaluation> {
  const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON.

{
  "score":8,
  "feedback":"Good explanation. Mention time complexity.",
  "ideal_answer":"A complete model answer..."
}

Rules:
- score must be between 0 and 10
- feedback should be concise
- ideal_answer should be technically correct

No markdown.
No explanation.
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
  } catch (error) {
    console.error("Answer Evaluation Error");
    console.error(text);

    return {
      score: 0,
      feedback:
        "Unable to evaluate this answer due to an AI formatting error.",
      ideal_answer: "",
    };
  }
}

// ----------------------------
// Generate Overall Interview Summary
// ----------------------------

export async function generateInterviewSummary(
  overallScore: number,
  evaluations: {
    question: string;
    score: number;
    feedback: string;
  }[]
): Promise<InterviewSummary> {
  const prompt = `
You are a senior FAANG interviewer.

A candidate has completed an interview.

Overall Score:
${overallScore}/10

Question Evaluations:

${evaluations
  .map(
    (item, index) => `
Question ${index + 1}

Question:
${item.question}

Score:
${item.score}/10

Feedback:
${item.feedback}
`
  )
  .join("\n")}

Generate:

1. A professional interview summary.
2. Exactly 5 personalized recommendations.

Return ONLY JSON.

{
  "overall_feedback":"...",
  "recommendations":[
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}

No markdown.
No explanation.
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
  } catch (error) {
    console.error("Interview Summary Error");
    console.error(text);

    return {
      overall_feedback:
        "Interview completed successfully. AI summary could not be generated.",
      recommendations: [],
    };
  }
}