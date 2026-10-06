from pydantic import BaseModel, Field
from typing import List, Optional


class JobProfile(BaseModel):
    job_id: Optional[str] = None

    title: str

    company: Optional[str] = None

    required_skills: List[str] = Field(default_factory=list)

    preferred_skills: List[str] = Field(default_factory=list)

    description: Optional[str] = None

    minimum_cgpa: Optional[float] = None

    allowed_branches: List[str] = Field(default_factory=list)

    experience_required: Optional[str] = None