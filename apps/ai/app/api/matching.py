from fastapi import APIRouter

from app.schemas.student import StudentProfile
from app.schemas.job import JobProfile
from app.schemas.response import MatchResponse
from app.services.job_matching import (
    match_student_to_job,
    match_resume_to_job
)

router = APIRouter(
    prefix="/match",
    tags=["Job Matching"]
)


@router.post("/", response_model=MatchResponse)
def match_job(
    student: StudentProfile,
    job: JobProfile
):
    student_profile_text = (
        "Skills: "
        + ", ".join(student.skills)
        + "\nProjects: "
        + ", ".join(student.projects)
        + "\nEducation: "
        + (student.education or "")
        + "\nBranch: "
        + (student.branch or "")
        + "\nCGPA: "
        + str(student.cgpa or "")
        + "\nResume: "
        + (student.resume_text or "")
    )

    result = match_student_to_job(
        student_skills=student.skills,
        student_profile_text=student_profile_text,
        required_skills=job.required_skills,
        job_description=job.description or ""
    )

    return result


@router.post("/resume")
def match_resume_job(
    student: StudentProfile,
    job: JobProfile
):
    result = match_resume_to_job(
        resume_text=student.resume_text or "",
        required_skills=job.required_skills,
        job_description=job.description or ""
    )

    return result