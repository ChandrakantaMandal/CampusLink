from fastapi import APIRouter

from app.schemas.student import StudentProfile
from app.schemas.response import ReadinessResponse
from app.services.readiness import calculate_readiness

router = APIRouter(
    prefix="/readiness",
    tags=["Readiness"]
)


@router.post("/", response_model=ReadinessResponse)
def readiness(
    student: StudentProfile
):
    result = calculate_readiness(
        skills=student.skills,
        projects=student.projects,
        cgpa=student.cgpa,
        certifications=student.certifications,
        target_role=student.target_role
    )

    return result