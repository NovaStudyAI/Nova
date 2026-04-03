const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { videoUrl, subject } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate detailed, study notes and 5 flashcards for a student based on this YouTube video: ${videoUrl}. The subject is ${subject}. Return the response as a JSON object with these keys: title, subject, date, pages, summary, content, and flashcards (an array of q and a objects).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // This part cleans the AI text and turns it into a real object
    const cleanText = text.replace(/```json|```/g, "");
    const data = JSON.parse(cleanText);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI is sleeping, try again!", error: error.message });
  }
}