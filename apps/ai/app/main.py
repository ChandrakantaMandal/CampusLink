from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.matching import router as matching_router
from app.api.skill_gap import router as skill_gap_router
from app.api.readiness import router as readiness_router
from app.api.resume import router as resume_router
from app.api.recommendation import router as recommendation_router

app = FastAPI(
    title="CampusLink AI Service",
    description="AI/ML service for CampusLink",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(matching_router)
app.include_router(skill_gap_router)
app.include_router(readiness_router)
app.include_router(resume_router)
app.include_router(recommendation_router)


@app.get("/")
def root():
    return {
        "message": "CampusLink AI Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "campuslink-ai"
    }