// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai'; // ❌ OpenRouter client (commented out)

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { convertToCoreMessages } from 'ai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY!,
//   baseURL: 'https://openrouter.ai/api/v1',
// }); // ❌ OpenRouter setup (commented out)

const ollama = createOpenAI({
  apiKey: 'ollama', // dummy value, required by @ai-sdk/openai
  baseURL: 'http://localhost:11434/v1', // ✅ Ollama running locally
  compatibility: 'compatible',
});

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  try {
    const result = await streamText({
      model: ollama('deepseek-r1:latest'),
      system:
        'You are an assistant that returns only the final emojified version of the input text. Do not explain or show your thought process.',
      messages: [
        {
          role: 'user',
          content:
            'Emojify the following text. Only return the final result:\n\n' + input,
        },
      ],
    });

    return result.toDataStreamResponse(); // ✅ streaming!
  } catch (error: any) {
    console.error('Ollama/AI SDK Error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Something went wrong' },
      { status: 500 }
    );
  }
}
