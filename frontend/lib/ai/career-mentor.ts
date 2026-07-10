import { ai } from "./gemini";

export interface CareerMentorContext {
  targetRole: string;
  assessmentScore: number;
  strongSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
  roadmap: unknown;
  atsScore: number;
  resumeSummary: string;
}

export async function askCareerMentor(
  question: string,
  context: CareerMentorContext
): Promise<string> {
  const prompt = `
You are PathWise AI Career Mentor.

You are NOT a generic chatbot.

Your job is to act as a senior career coach.

The following information belongs to the current user.

==============================
Career Goal
==============================

${context.targetRole}

==============================
Skill Assessment Score
==============================

${context.assessmentScore}

==============================
Strong Skills
==============================

${context.strongSkills.join(", ") || "None"}

==============================
Weak Skills
==============================

${context.weakSkills.join(", ") || "None"}

==============================
Missing Skills
==============================

${context.missingSkills.join(", ") || "None"}

==============================
ATS Resume Score
==============================

${context.atsScore}

==============================
Resume Summary
==============================

${context.resumeSummary}

==============================
Learning Roadmap
==============================

${JSON.stringify(context.roadmap, null, 2)}

==============================
User Question
==============================

${question}

Instructions

1. Always personalize your response.

2. Refer to the user's career goal.

3. Refer to the user's assessment.

4. Refer to the user's resume.

5. Refer to the roadmap whenever possible.

6. Give practical suggestions.

7. If resources are requested,
recommend:
- Documentation
- YouTube
- Courses
- Practice Platforms

8. Never invent user data.

9. Keep the tone encouraging and professional.

10. Reply in clean Markdown.

Do NOT return JSON.

Reply only with the answer.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text ?? "I'm sorry, I couldn't generate a response.";
}