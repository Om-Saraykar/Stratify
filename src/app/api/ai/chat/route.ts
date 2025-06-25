// app/api/ai/chat/route.js

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from 'openai';

// Ensure these environment variables are set in your .env.local file
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Define the OpenRouter base URL and the model you want to use
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "deepseek/deepseek-r1-distill-qwen-32b:free"; // Your specified model from OpenRouter

// Initialize the OpenAI client to connect to OpenRouter
const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY, // Use your OpenRouter API key
});

/**
 * Handles POST requests to the /api/ai/chat endpoint using manual streaming.
 * @param {NextRequest} req The incoming request object from Next.js.
 * @returns {NextResponse} A streaming response containing the AI's chat output.
 */
export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    console.log('Received chat messages for OpenRouter (Manual Streaming):', messages);

    const response = await openai.chat.completions.create({
      model: MODEL,
      stream: true, // Crucial for streaming
      messages: messages,
    });

    // Create a readable stream for the response body
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          // Each chunk is an OpenAI ChatCompletionChunk
          // Extract the content from the first choice, if available
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
      // Optional: Add a cancel method for cleanup if the client disconnects early
      cancel() {
        console.log('Client disconnected, stream cancelled.');
      }
    });

    // Return the stream in a NextResponse
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain', // Or 'text/event-stream' if your client expects it
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in /api/ai/chat (Manual Streaming):', error);

    let statusCode = 500;
    let errorMessage = "Internal server error.";

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        statusCode = 401;
        errorMessage = "Authentication failed. Check your OpenRouter API key.";
      }
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
