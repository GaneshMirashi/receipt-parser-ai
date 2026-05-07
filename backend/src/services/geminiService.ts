import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const extractReceiptData = async (
  imagePath: string
) => {

  console.log("API KEY:", process.env.GEMINI_API_KEY);

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY as string
  );

  try {

    const model = genAI.getGenerativeModel({
  model: "models/gemini-flash-latest",
});

    const imageBuffer = fs.readFileSync(imagePath);

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/png",
      },
    };

    const prompt = `
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
- Extract only actual purchased items
- Ignore invoice numbers, loan details, account numbers, taxes, metadata
- If merchant is missing, return null
- If date is unclear, return null
- If total is missing, return 0
- Return amount as number only
- No markdown
- No explanation
- Return valid JSON only
`;

    const result = await model.generateContent([
      prompt,
      imagePart,
    ]);

    let raw = result.response.text().trim();

    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(raw);
    } catch (error) {
      return {
        merchant: "",
        date: "",
        lineItems: [],
        total: 0,
        error: "Invalid AI response",
        raw,
      };
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};