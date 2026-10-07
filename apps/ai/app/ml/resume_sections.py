import re


SECTION_NAMES = {
    "projects": [
        "projects",
        "project experience",
        "academic projects",
        "personal projects",
    ],
    "education": [
        "education",
        "academic background",
    ],
    "certifications": [
        "certifications",
        "certificates",
        "courses",
    ],
}


ALL_SECTION_NAMES = [
    "projects",
    "project experience",
    "academic projects",
    "personal projects",
    "education",
    "academic background",
    "certifications",
    "certificates",
    "courses",
    "achievements",
    "activities",
]


def extract_section(text: str, section_names: list[str]) -> str:
    """
    Extract content from a specific resume section.
    """

    if not text:
        return ""

    section_pattern = "|".join(
        re.escape(section)
        for section in section_names
    )

    next_sections = "|".join(
        re.escape(section)
        for section in ALL_SECTION_NAMES
    )

    pattern = (
        rf"\b(?:{section_pattern})\b"
        rf"(.*?)(?=\b(?:{next_sections})\b|$)"
    )

    matches = re.findall(
        pattern,
        text,
        flags=re.IGNORECASE | re.DOTALL
    )

    if not matches:
        return ""

    # Use the last matching section.
    return matches[-1].strip()


def extract_resume_sections(text: str) -> dict:
    """
    Extract important sections from resume text.
    """

    return {
        "projects": extract_section(
            text,
            SECTION_NAMES["projects"]
        ),
        "education": extract_section(
            text,
            SECTION_NAMES["education"]
        ),
        "certifications": extract_section(
            text,
            SECTION_NAMES["certifications"]
        ),
    }
def extract_projects(text: str) -> list[str]:
    """
    Extract project names from resume text.
    """

    if not text:
        return []

    project_patterns = [
        "smartreco",
        "face recognition attendance system",
        "salary prediction",
    ]

    found_projects = []

    text_lower = text.lower()

    for project in project_patterns:
        if project in text_lower:
            found_projects.append(project)

    return found_projects