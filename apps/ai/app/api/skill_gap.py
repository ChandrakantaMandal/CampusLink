from fastapi import APIRouter

from app.schemas.student import StudentProfile
from app.schemas.job import JobProfile
from app.schemas.response import SkillGapResponse
from app.services.skill_gap import analyze_skill_gap

router = APIRouter(
    prefix="/skill-gap",
    tags=["Skill Gap"]
)


@router.post("/", response_model=SkillGapResponse)
def skill_gap(
    student: StudentProfile,
    job: JobProfile
):
    result = analyze_skill_gap(
        student_skills=student.skills,
        required_skills=job.required_skills
    )

    return result