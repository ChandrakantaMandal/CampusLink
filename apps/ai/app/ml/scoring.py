def normalize_skill(skill: str) -> str:
    """
    Convert skill text into a normalized format
    so that small differences in capitalization
    do not affect matching.
    """
    return skill.strip().lower()


def calculate_skill_match(
    student_skills: list[str],
    required_skills: list[str]
) -> dict:
    """
    Compare student's skills with the job's required skills.
    """

    student_normalized = {
        normalize_skill(skill)
        for skill in student_skills
    }

    required_normalized = {
        normalize_skill(skill)
        for skill in required_skills
    }

    matched_skills = [
        skill
        for skill in required_skills
        if normalize_skill(skill) in student_normalized
    ]

    missing_skills = [
        skill
        for skill in required_skills
        if normalize_skill(skill) not in student_normalized
    ]

    if not required_skills:
        skill_score = 0.0
    else:
        skill_score = (
            len(matched_skills) / len(required_skills)
        ) * 100

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_score": round(skill_score, 2)
    }