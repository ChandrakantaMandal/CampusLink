import re


def clean_text(text: str) -> str:
    """
    Clean text before NLP/ML processing.
    """

    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Replace hyphens with spaces
    text = text.replace("-", " ")

    # Keep letters, numbers, + and # for skills like C++ and C#
    text = re.sub(r"[^a-z0-9+#.\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()