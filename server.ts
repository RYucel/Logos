import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Greek TTS Audio Streaming Endpoint
  // Streams authentic native Greek speech audio for any Greek phrase/sentence
  app.get('/api/tts', async (req, res) => {
    try {
      const text = req.query.text as string;
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text query parameter is required' });
        return;
      }

      const cleanText = text.trim();
      if (!cleanText) {
        res.status(400).json({ error: 'Text cannot be empty' });
        return;
      }

      // Encode query for Google's native Modern Greek TTS voice engine
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=el&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });

      if (!response.ok) {
        res.status(502).json({ error: 'Failed to fetch Greek audio stream' });
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', buffer.length.toString());
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable'); // Cache audio for performance
      res.send(buffer);
    } catch (error) {
      console.error('Error in /api/tts endpoint:', error);
      res.status(500).json({ error: 'Internal TTS error' });
    }
  });

  // Vite middleware for development vs Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LOGOS Greek Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
