import { describe, expect, it } from "vitest";
import { assessmentQuestionSchema } from "../../../../src/modules/assessments/assessment.schema";

const questions = Array.from({ length: 10 }, (_, index) => ({
  prompt: `Question number ${index + 1}?`,
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 0,
  explanation: "Option A is correct for this example.",
}));

describe("assessmentQuestionSchema", () => {
  it("accepts exactly ten well-formed questions", () => {
    expect(assessmentQuestionSchema.safeParse({ questions }).success).toBe(
      true,
    );
  });

  it("rejects a question set with the wrong count", () => {
    expect(
      assessmentQuestionSchema.safeParse({ questions: questions.slice(0, 9) })
        .success,
    ).toBe(false);
  });

  it("rejects questions without four answer options", () => {
    expect(
      assessmentQuestionSchema.safeParse({
        questions: questions.map((question, index) =>
          index === 0 ? { ...question, options: ["Only one"] } : question,
        ),
      }).success,
    ).toBe(false);
  });
});
