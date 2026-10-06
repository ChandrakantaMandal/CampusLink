import pymupdf
import json
import re

from app.services.gemini import generate_gemini_response


def extract_text_from_pdf(file_path: str) -> str:
    document = pymupdf.open(file_path)

    pages_text = []

    for page in document:
        pages_text.append(page.get_text())

    document.close()

    return "\n".join(pages_text)


def analyze_resume_text(text: str) -> dict:
    """
    Analyze resume text using Gemini.
    """

    if not text.strip():
        raise ValueError("Resume text is empty.")

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

    response = generate_gemini_response(prompt)

    response = response.strip()

    # Remove accidental markdown code fences
    response = re.sub(
        r"^```json\s*|\s*```$",
        "",
        response,
        flags=re.IGNORECASE
    )

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned an invalid JSON response."
        )

    return {
        "text": text,
        "word_count": len(text.split()),
        "skills": result.get("skills", []),
        "projects": result.get("projects", []),
        "education": result.get("education", ""),
        "certifications": result.get("certifications", []),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "recommendations": result.get("recommendations", [])
    }


def analyze_resume(file_path: str) -> dict:
    """
    Extract text from PDF and analyze it using Gemini.
    """

    text = extract_text_from_pdf(file_path)

    return analyze_resume_text(text)