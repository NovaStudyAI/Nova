import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { videoUrl, subject } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate a study title, a 3-sentence, summary, and 3 flashcards for this video: ${videoUrl}. Return as JSON with keys: title, summary, flashcards (array of {q, a}).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
  
    const cleanText = text.replace(/```json|```/g, "");
    const data = JSON.parse(cleanText);

    res.status(200).json({
      ...data,
      id: Date.now(),
      subject: subject || "General",
      date: new Date().toLocaleDateString()
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: error.message });
  }
}