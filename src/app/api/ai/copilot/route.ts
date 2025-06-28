// pages/api/ai/copilot.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, prompt } = req.body;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek:latest',
        prompt: `${system}\n\n${prompt}`,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error('Failed to fetch from Ollama');
    }

    const data = await ollamaResponse.json();

    return res.status(200).json({ completion: data.response.trim() });
  } catch (error) {
    console.error('Ollama error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
