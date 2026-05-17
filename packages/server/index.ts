import express, {
  type Request,
  type Response,
  type Application,
} from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
});

// Middleware to parse JSON
app.use(express.json());

// Basic GET route
app.get('/api/hello', (req: Request, res: Response) => {
  res.send('Hello Jeff!');
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 100,
      },
    });

    res.json({ message: response.text });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

// Example REST endpoint (POST)
app.post('/api/data', (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({ message: `Received ${name}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
