import json
import re

from app.services.gemini import generate_gemini_response


def normalize_skill(skill: str) -> str:
    """
    Normalize skill names for reliable comparison.
    """
    skill = skill.lower().strip()

    aliases = {
        "scikit learn": "scikit-learn",
        "sklearn": "scikit-learn",
        "scikit_learn": "scikit-learn",

        "machine-learning": "machine learning",
        "machine_learning": "machine learning",

        "deep-learning": "deep learning",
        "deep_learning": "deep learning",

        "fast api": "fastapi",
        "fast-api": "fastapi",

        "node js": "node.js",
        "nodejs": "node.js",

        "reactjs": "react",
        "react.js": "react",

        "postgres": "postgresql",
        "postgre sql": "postgresql",

        "git hub": "github",
        "git-hub": "github",

        "amazon web services": "aws",
    }

    return aliases.get(skill, skill)


def match_student_to_job(
    student_skills: list[str],
    student_profile_text: str,
    required_skills: list[str],
    job_description: str
) -> dict:
    """
    Fast local skill-based job matching.

    No Gemini API call is used here.
    This allows many jobs to be matched quickly without
    hitting Gemini rate limits.
    """

    # Normalize student skills
    student_skill_map = {
        normalize_skill(skill): skill
        for skill in student_skills
    }

    # Normalize required skills
    required_skill_map = {
        normalize_skill(skill): skill
        for skill in required_skills
    }

    matched_skills = []
    missing_skills = []

    for normalized_required, original_required in required_skill_map.items():

        if normalized_required in student_skill_map:
            matched_skills.append(original_required)
        else:
            missing_skills.append(original_required)

    total_required = len(required_skill_map)
    total_matched = len(matched_skills)

    # Calculate score
    if total_required == 0:
        match_score = 100
    else:
        match_score = round(
            (total_matched / total_required) * 100,
            2
        )

    # Generate explanation locally
    if total_required == 0:
        explanation = (
            "The job does not list any required skills, "
            "so the student matches all listed requirements."
        )

    elif match_score == 100:
        explanation = (
            "The student possesses all required skills "
            "for the job, resulting in a perfect match."
        )

    elif total_matched == 0:
        explanation = (
            "The student does not currently have any of "
            "the required skills for this job."
        )

    else:
        matched_text = ", ".join(matched_skills)
        missing_text = ", ".join(missing_skills)

        explanation = (
            f"The student possesses {total_matched} out of "
            f"{total_required} required skills "
            f"({matched_text})"
        )

        if missing_skills:
            explanation += (
                f", missing {missing_text}."
            )
        else:
            explanation += "."

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation": explanation,
    }


def match_resume_to_job(
    resume_text: str,
    required_skills: list[str],
    job_description: str
) -> dict:
    """
    Match a resume directly with a job using Gemini.
    """

    prompt = f"""
You are an AI resume-to-job matching assistant for CampusLink.

Analyze this resume against the job requirements.

RESUME:
{resume_text}

REQUIRED JOB SKILLS:
{", ".join(required_skills)}

JOB DESCRIPTION:
{job_description}

Determine:

1. Match score from 0 to 100.
2. Skills clearly present in the resume.
3. Required skills missing from the resume.
4. A short explanation.

IMPORTANT RULES:
- Only evaluate the required job skills.
- Do not invent skills.
- Do not assume a skill unless the resume clearly supports it.
- Return ONLY valid JSON.
- Do not use markdown.
- match_score must be between 0 and 100.

Return exactly:

{{
    "match_score": 0,
    "extracted_skills": [],
    "matched_skills": [],
    "missing_skills": [],
    "explanation": ""
}}
"""

    response = generate_gemini_response(prompt)

    response = response.strip()

    response = re.sub(
        r"^```json\s*|\s*```$",
        "",
        response,
        flags=re.IGNORECASE
    )

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned an invalid JSON response."
        )

    return {
        "match_score": float(
            result.get("match_score", 0)
        ),
        "extracted_skills": result.get(
            "extracted_skills", []
        ),
        "matched_skills": result.get(
            "matched_skills", []
        ),
        "missing_skills": result.get(
            "missing_skills", []
        ),
        "explanation": result.get(
            "explanation", ""
        )
    }