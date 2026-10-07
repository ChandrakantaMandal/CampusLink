from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os

from app.services.resume_analyzer import analyze_resume


router = APIRouter(
    prefix="/resume",
    tags=["Resume Analysis"]
)


@router.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...)
):
    """
    Upload and analyze a PDF resume.
    """

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    file_content = await file.read()

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(file_content)
            temp_path = temp_file.name

        result = analyze_resume(temp_path)

        return result

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)