from app.services.gemini import generate_gemini_response


def generate_recommendations(
    missing_skills: list[str],
    target_role: str | None = None,
    student_skills: list[str] | None = None,
    projects: list[str] | None = None
) -> list[str]:
    """
    Generate personalized recommendations using Gemini
    based on the student's missing skills.
    """

    if not missing_skills:
        return [
            "You have all the required skills for this job."
        ]

    student_skills = student_skills or []
    projects = projects or []

    missing_skills_text = ", ".join(missing_skills)
    student_skills_text = ", ".join(student_skills)
    projects_text = ", ".join(projects)

    prompt = f"""
You are a career recommendation assistant for CampusLink.

Target role:
{target_role or "Not specified"}

Student skills:
{student_skills_text or "Not specified"}

Student projects:
{projects_text or "Not specified"}

Missing job skills:
{missing_skills_text}

Give practical recommendations to help the student
improve their profile for the target role.

Focus ONLY on the missing skills.

For each missing skill:
1. Explain briefly what the student should learn.
2. Suggest one practical project or task using that skill.

Keep the response concise and student-friendly.
Do not recommend skills that are not in the missing skills list.
"""

    response = generate_gemini_response(prompt)

    return [
        line.strip()
        for line in response.split("\n")
        if line.strip()
    ]