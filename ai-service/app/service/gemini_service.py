import google.generativeai as genai
import json
import os

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)


async def extract_receipt_data(image_data):

    prompt = """
You are an AI receipt parser.

Analyze the receipt image carefully and extract structured receipt data.

Return ONLY valid JSON.

Required JSON format:

{
  "merchant": "string",
  "date": "YYYY-MM-DD",
  "lineItems": [
    {
      "name": "string",
      "amount": number
    }
  ],
  "total": number
}

Rules:
- Extract only purchased items
- Ignore invoice numbers
- Ignore metadata
- Return valid JSON only
"""

    response = model.generate_content(
        [
            prompt,
            {
                "mime_type": "image/png",
                "data": image_data
            }
        ]
    )

    raw = response.text.strip()

    raw = raw.replace("```json", "")
    raw = raw.replace("```", "")

    return json.loads(raw)