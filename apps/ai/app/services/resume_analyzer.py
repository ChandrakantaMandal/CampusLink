import json
import re

import pymupdf

from app.services.gemini import generate_gemini_response


MAX_TEXT_LENGTH = 12000


def extract_text_from_pdf(file_path: str) -> str:
    """
    Safely extract text from a PDF.
    """

    try:
        document = pymupdf.open(file_path)

        if document.page_count == 0:
            document.close()
            raise ValueError("PDF has no pages.")

        pages_text = []

        for page in document:
            page_text = page.get_text()

            if page_text:
                pages_text.append(page_text)

        document.close()

    except ValueError:
        raise

    except Exception as error:
        raise ValueError(
            "Invalid or corrupted PDF file."
        ) from error

    text = "\n".join(pages_text).strip()

    if not text:
        raise ValueError(
            "This PDF does not contain readable text. "
            "Please upload a text-based resume PDF."
        )

    return text


def analyze_resume_text(text: str) -> dict:
    """
    Analyze resume text using Gemini.
    """

    text = text.strip()

    if not text:
        raise ValueError("Resume text is empty.")

    # Prevent unnecessarily huge Gemini prompts.
    if len(text) > MAX_TEXT_LENGTH:
        text = text[:MAX_TEXT_LENGTH]

    prompt = f"""
You are an AI resume analyzer for CampusLink.

Analyze the following student resume.

RESUME:
{text}

Extract and analyze:

1. Skills
2. Projects
3. Education
4. Certifications
5. Resume strengths
6. Resume weaknesses
7. Practical improvement recommendations

IMPORTANT RULES:
- Only use information explicitly present in the resume.
- Do not invent skills, projects, education, certifications, or achievements.
- Keep skill names concise.
- Keep projects concise.
- Give practical recommendations.
- Return ONLY valid JSON.
- Do not use markdown.

Return exactly this structure:

{{
    "skills": [],
    "projects": [],
    "education": "",
    "certifications": [],
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
}}
"""

    try:
        response = generate_gemini_response(prompt)
    except Exception as error:
        raise ValueError(
            "AI resume analysis is temporarily unavailable. "
            "Please try again."
        ) from error

    response = response.strip()

    # Remove accidental markdown code fences.
    response = re.sub(
        r"^```json\s*|\s*```$",
        "",
        response,
        flags=re.IGNORECASE,
    ).strip()

    try:
        result = json.loads(response)
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI returned an invalid resume analysis."
        ) from error

    return {
        "text": text,
        "word_count": len(text.split()),
        "skills": result.get("skills", []),
        "projects": result.get("projects", []),
        "education": result.get("education", ""),
        "certifications": result.get("certifications", []),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "recommendations": result.get("recommendations", []),
    }


def analyze_resume(file_path: str) -> dict:
    """
    Extract text from PDF and analyze it using Gemini.
    """

    text = extract_text_from_pdf(file_path)

    return analyze_resume_text(text)