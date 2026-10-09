from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os

from app.services.resume_analyzer import (
    analyze_resume_text,
    extract_text_from_pdf,
)


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

        try:
            text = extract_text_from_pdf(temp_path)
        except ValueError as error:
            raise HTTPException(
                status_code=400,
                detail=str(error),
            ) from error

        try:
            result = analyze_resume_text(text)
        except ValueError as error:
            raise HTTPException(
                status_code=502,
                detail=str(error),
            ) from error

        return result

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                # Best-effort cleanup: never mask the actual
                # response/error with a Windows file lock.
                pass