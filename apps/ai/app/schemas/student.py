from pydantic import BaseModel, Field
from typing import List, Optional


class StudentProfile(BaseModel):
    student_id: Optional[str] = None

    name: Optional[str] = None

    skills: List[str] = Field(default_factory=list)

    projects: List[str] = Field(default_factory=list)

    education: Optional[str] = None

    branch: Optional[str] = None

    cgpa: Optional[float] = None

    certifications: List[str] = Field(default_factory=list)

    target_role: Optional[str] = None

    resume_text: Optional[str] = None