from app.services.gemini import generate_gemini_response

import json
import re


def calculate_readiness(
    skills: list[str],
    projects: list[str],
    cgpa: float | None,
    certifications: list[str],
    target_role: str | None = None
) -> dict:
    """
    Analyze a student's job readiness using Gemini.
    """

    target = target_role.strip() if target_role else "Not specified"

    prompt = f"""
You are an AI career readiness advisor for CampusLink.

Analyze the student's actual profile and determine their overall job readiness.

IMPORTANT:
Even if the target role is not specified, you MUST still evaluate the
student using the skills, projects, CGPA, and certifications that are provided.

TARGET ROLE:
{target}

STUDENT SKILLS:
{", ".join(skills) if skills else "None"}

STUDENT PROJECTS:
{", ".join(projects) if projects else "None"}

CGPA:
{cgpa if cgpa is not None else "Not provided"}

CERTIFICATIONS:
{", ".join(certifications) if certifications else "None"}

Evaluate the student's readiness using ONLY the information above.

Consider:
1. Technical skills
2. Practical projects
3. Academic performance
4. Certifications
5. Relevance to target role, if a target role is provided

If the target role is "Not specified":
- Do NOT say that the student has no skills.
- Do NOT say that the student has no projects if projects are provided.
- Do NOT say that CGPA is not provided if CGPA is provided.
- Evaluate overall job readiness from the available profile.

IMPORTANT RULES:
- Use the actual student data provided above.
- Do not ignore provided skills, projects, CGPA, or certifications.
- Do not invent any information.
- Readiness score must be between 0 and 100.
- Give strengths based on information actually provided.
- Give weaknesses based on actual missing areas.
- Give practical recommendations.
- Return ONLY valid JSON.
- Do not use markdown.

Return exactly this structure:

{{
    "readiness_score": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
}}
"""

    response = generate_gemini_response(prompt).strip()

    response = re.sub(
        r"^```json\s*|\s*```$",
        "",
        response,
        flags=re.IGNORECASE
    ).strip()

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        raise ValueError("Gemini returned an invalid JSON response.")

    return {
        "readiness_score": float(result.get("readiness_score", 0)),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "recommendations": result.get("recommendations", [])
    }