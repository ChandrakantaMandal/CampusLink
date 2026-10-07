import os
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()


def generate_gemini_response(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the generated response.
    Retries automatically if Gemini is temporarily unavailable.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured."
        )

    client = genai.Client(
        api_key=api_key
    )

    max_retries = 3

    for attempt in range(max_retries):
        try:
            interaction = client.interactions.create(
                model="gemini-3.5-flash-lite",
                input=prompt
            )

            return interaction.output_text

        except Exception as error:
            error_text = str(error)

            if "503" not in error_text:
                raise

            if attempt == max_retries - 1:
                raise

            time.sleep(2)