// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat', 
      messages: [{ role: 'user', content: input }],
    });

    return NextResponse.json({
      text: chatCompletion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('OpenRouter API Error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Something went wrong' },
      { status: 500 }
    );
  }
}
