import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const apiKey = process.env.GENAI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GENAI_API_KEY / GEMINI_API_KEY not set. Set it in your environment before using the API.');
}

const client = new GoogleGenAI({ apiKey: apiKey || '' });

interface GenAIRequest {
  model?: string;
  contents: any[];
  config?: any;
}

// Non-streaming endpoint (simple response)
app.post('/api/genai', async (req: Request, res: Response) => {
  try {
    const { model = 'gemini-2.0-flash', contents, config }: GenAIRequest = req.body;
    if (!contents) return res.status(400).json({ error: 'Missing `contents` in body' });

    const stream = await client.models.generateContentStream({ model, contents, config: config || {} });
    let out = '';
    for await (const chunk of stream) {
      if (chunk.text) out += chunk.text;
    }

    return res.json({ text: out });
  } catch (err) {
    console.error('GenAI error', err);
    return res.status(500).json({ error: String(err) });
  }
});

// Streaming endpoint (progressive text chunks via Server-Sent Events)
app.post('/api/genai/stream', async (req: Request, res: Response) => {
  try {
    const { model = 'gemini-2.0-flash', contents, config }: GenAIRequest = req.body;
    if (!contents) return res.status(400).json({ error: 'Missing `contents` in body' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const stream = await client.models.generateContentStream({ model, contents, config: config || {} });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('GenAI stream error', err);
    res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
    res.end();
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', apiKeyConfigured: !!apiKey });
});

app.listen(PORT, () => {
  console.log(`✅ GenAI server listening on http://localhost:${PORT}`);
  console.log(`📝 POST /api/genai - non-streaming responses`);
  console.log(`🔄 POST /api/genai/stream - Server-Sent Events streaming`);
  console.log(`❤️  GET /api/health - health check`);
});

// Security note: keep this server-side only; do not expose API keys to frontend.
