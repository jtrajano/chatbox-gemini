import express, { type Request, type Response, type Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();


const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic GET route
app.get('/api/hello', (req: Request, res: Response) => {
  res.send('Hello Jeff!');
});

// Example REST endpoint (POST)
app.post('/api/data', (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({ message: `Received ${name}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
