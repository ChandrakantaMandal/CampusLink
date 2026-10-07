import re


SKILL_ALIASES = {
    "scikit learn": "scikit-learn",
    "scikit-learn": "scikit-learn",
    "react.js": "react",
    "react js": "react",
    "machine-learning": "machine learning",
    "opencv": "opencv",
}


SKILL_VOCABULARY = [
    "python",
    "numpy",
    "pandas",
    "matplotlib",
    "seaborn",
    "scikit learn",
    "scikit-learn",
    "machine learning",
    "deep learning",
    "supervised learning",
    "unsupervised learning",
    "tensorflow",
    "pytorch",
    "opencv",
    "computer vision",
    "image processing",
    "face detection",
    "face recognition",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "flask",
    "fastapi",
    "react",
    "react.js",
    "javascript",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "google cloud",
    "jupyter notebook",
    "google colab",
    "data analysis",
    "data cleaning",
]


def normalize_skill(skill: str) -> str:
    """
    Convert different skill names into one canonical name.
    """

    skill = skill.strip().lower()

    return SKILL_ALIASES.get(skill, skill)


def extract_skills(text: str) -> list[str]:
    """
    Extract and normalize technical skills from resume text.
    """

    if not text:
        return []

    text = text.lower()

    found_skills = []

    for skill in SKILL_VOCABULARY:

        skill_pattern = (
            r"(?<!\w)"
            + re.escape(skill.lower())
            + r"(?!\w)"
        )

        if re.search(skill_pattern, text):

            normalized_skill = normalize_skill(skill)

            if normalized_skill not in found_skills:
                found_skills.append(normalized_skill)

    return found_skills