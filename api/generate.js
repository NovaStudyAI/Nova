import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { videoUrl, subject } = req.body;

    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' } // <--- THIS IS THE KEY
    );
    
    const prompt = 'Generate a study title, a 3-sentence summary, and 3 flashcards for this video: ${videoUrl}. Return strictly as JSON with keys: title, summary, flashcards (array of {q, a}).;'

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "");
    const data = JSON.parse(text);

    res.status(200).json({
      ...data,
      id: Date.now(),
      subject: subject || "General",
      date: new Date().toLocaleDateString()
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    
    res.status(500).json({ message: error.message });
  }
}