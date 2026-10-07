import re


def normalize_skill(skill: str) -> str:
    """Normalize skill names for reliable comparison."""
    return re.sub(r"[^a-z0-9]", "", skill.lower().strip())


# Clearly equivalent skill names
SKILL_ALIASES = {
    "sklearn": "scikitlearn",
    "scikitlearn": "scikitlearn",
    "scikit-learn": "scikitlearn",
    "tf": "tensorflow",
    "tensorflow": "tensorflow",
    "pytorch": "pytorch",
    "py torch": "pytorch",
}


def canonical_skill(skill: str) -> str:
    normalized = normalize_skill(skill)

    return SKILL_ALIASES.get(
        normalized,
        normalized,
    )


def analyze_skill_gap(
    student_skills: list[str],
    required_skills: list[str],
) -> dict:
    """
    Analyze student's skills against the selected job's
    required skills without using Gemini.

    Only skills required by the selected job are evaluated.
    """

    student_skill_map = {
        canonical_skill(skill): skill
        for skill in student_skills
    }

    matched_skills = []
    missing_skills = []

    for required_skill in required_skills:
        required_key = canonical_skill(required_skill)

        if required_key in student_skill_map:
            matched_skills.append(required_skill)
        else:
            missing_skills.append(required_skill)

    total_required = len(required_skills)
    total_missing = len(missing_skills)

    if total_required == 0:
        skill_gap_score = 0
    else:
        skill_gap_score = round(
            (total_missing / total_required) * 100,
            2,
        )

    if total_required == 0:
        explanation = (
            "This job does not have any required skills defined."
        )
    elif total_missing == 0:
        explanation = (
            "The student possesses all required skills for this job, "
            "resulting in a perfect match."
        )
    else:
        explanation = (
            f"The student possesses {len(matched_skills)} out of "
            f"{total_required} required skills"
        )

        if matched_skills:
            explanation += (
                f" ({', '.join(matched_skills)})"
            )

        explanation += (
            f", missing {len(missing_skills)} skill"
            f"{'s' if len(missing_skills) != 1 else ''}"
        )

        if missing_skills:
            explanation += (
                f" ({', '.join(missing_skills)})."
            )

    return {
        "skill_gap_score": float(skill_gap_score),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation": explanation,
    }