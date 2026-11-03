"""LLM integration client supporting Google Gemini API with smart offline fallback."""

import os
import json
import logging
from typing import Any, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("skillbridge.llm")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


class LLMClient:
    """Provides generative reasoning capabilities using Gemini with graceful fallback."""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.has_key = bool(self.api_key and not self.api_key.startswith("your_"))
        self._init_gemini()

    def _init_gemini(self):
        self.client = None
        if self.has_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI Client successfully.")
            except ImportError:
                try:
                    import google.generativeai as gai
                    gai.configure(api_key=self.api_key)
                    self.client = gai.GenerativeModel("gemini-1.5-flash")
                    logger.info("Initialized google-generativeai client successfully.")
                except Exception as e:
                    logger.warning(f"Could not initialize Gemini SDK: {e}. Using heuristic fallback.")

    def generate_json(self, prompt: str, system_instruction: str = "") -> Optional[Dict[str, Any]]:
        """Attempts to generate structured JSON using Gemini API."""
        if not self.has_key or not self.client:
            return None

        try:
            full_prompt = f"{system_instruction}\n\nRespond strictly with valid JSON:\n{prompt}"
            # Check which client is active
            if hasattr(self.client, "models") and hasattr(self.client.models, "generate_content"):
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=full_prompt,
                )
                text = response.text
            elif hasattr(self.client, "generate_content"):
                response = self.client.generate_content(full_prompt)
                text = response.text
            else:
                return None

            # Clean json fences if present
            cleaned = text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            
            return json.loads(cleaned.strip())
        except Exception as e:
            logger.warning(f"Gemini API request failed ({e}). Reverting to rule-based analysis.")
            return None


llm_client = LLMClient()

