import express, {
  type Request,
  type Response,
  type Application,
} from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON
app.use(express.json());

// Basic GET route
app.get('/api/hello', (req: Request, res: Response) => {
  res.send('Hello Jeff!');
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
  });

  res.json({ message: response.output_text });
});

// Example REST endpoint (POST)
app.post('/api/data', (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({ message: `Received ${name}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
