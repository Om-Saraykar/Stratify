// app/api/ai/chat/route.js

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "deepseek/deepseek-r1:free"; // deepseek/deepseek-chat

const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      // You might want to return plain text for errors too, or keep JSON for errors
      return new NextResponse("No messages provided.", { status: 400, headers: { "Content-Type": "text/plain" } });
    }

    console.log("Received chat messages:", messages);

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });

    const content = response.choices[0]?.message?.content;

    // --- CHANGE STARTS HERE ---
    // Return the content directly as plain text
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain", // Set the Content-Type header to text/plain
      },
    });
    // --- CHANGE ENDS HERE ---

  } catch (error) {
    console.error("Error in /api/ai/chat:", error);

    let statusCode = 500;
    let errorMessage = "Internal server error.";

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("401") || error.message.includes("Authentication")) {
        statusCode = 401;
        errorMessage = "Authentication failed. Check your OpenRouter API key.";
      }
    }

    // Returning error messages as plain text for consistency
    return new NextResponse(errorMessage, {
      status: statusCode,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}