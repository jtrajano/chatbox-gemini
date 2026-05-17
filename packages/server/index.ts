import express, {
  type Request,
  type Response,
  type Application,
} from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { type ChatMessage } from './interfaces/ChatMessage';
import type { TextChange } from 'typescript';

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

function getContents(messages: ChatMessage[], prompt: string) {
  if (Array.isArray(messages)) {
    return messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    }));
  } else if (typeof prompt === 'string') {
    return [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];
  } else {
    throw new Error(
      'Invalid input: Either "messages" (array) or a "prompt" (string) must be provided in the request body.'
    );
  }
}

// In-memory conversation database (stores ChatMessage history mapped by unique conversationId)
const conversations = new Map<string, ChatMessage[]>();

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, prompt, conversationId } = req.body;

    let contents;
    let activeConversationId = conversationId;
    let history: ChatMessage[] = [];

    // If conversationId is supplied, or a single prompt is sent (which defaults to starting/continuing a session)
    if (activeConversationId || typeof prompt === 'string') {
      if (!activeConversationId) {
        activeConversationId = crypto.randomUUID();
      }

      // 1. Retrieve the existing conversation history from our database
      history = conversations.get(activeConversationId) || [];

      // 2. Append the new message from the user
      if (typeof prompt === 'string') {
        history.push({ role: 'user', content: prompt });
      } else {
        res
          .status(400)
          .json({
            error:
              'A "prompt" string is required when using a session conversationId.',
          });
        return;
      }

      // 3. Map it to Gemini format
      contents = history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      }));
    } else {
      // Direct stateless mode fallback (stateless passing of custom messages)
      contents = getContents(messages, prompt);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        temperature: 0.2,
      },
    });

    const aiReply = response.text || '';

    // 4. Save the AI reply back into the session history
    if (activeConversationId) {
      history.push({ role: 'assistant', content: aiReply });
      conversations.set(activeConversationId, history);
    }

    res.json({
      message: aiReply,
      conversationId: activeConversationId,
    });
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
