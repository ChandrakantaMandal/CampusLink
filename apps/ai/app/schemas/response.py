from pydantic import BaseModel, Field
from typing import List


class MatchResponse(BaseModel):
    match_score: float = Field(ge=0, le=100)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    explanation: str = ""


class SkillGapResponse(BaseModel):
    skill_gap_score: float = Field(ge=0, le=100)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    explanation: str = ""


class ReadinessResponse(BaseModel):
    readiness_score: float = Field(ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)