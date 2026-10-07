from fastapi import APIRouter

from app.services.recommendation import generate_recommendations


router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)


@router.post("/")
def recommendation(
    missing_skills: list[str],
    target_role: str | None = None,
    student_skills: list[str] | None = None,
    projects: list[str] | None = None
):
    """
    Generate personalized recommendations
    using missing skills and student context.
    """

    recommendations = generate_recommendations(
        missing_skills=missing_skills,
        target_role=target_role,
        student_skills=student_skills,
        projects=projects
    )

    return {
        "missing_skills": missing_skills,
        "recommendations": recommendations
    }