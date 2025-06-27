import { NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "mistralai/mistral-small-3.2-24b-instruct:free" // deepseek/deepseek-r1-distill-qwen-32b:free

export async function POST(req: NextRequest) {
  try {
    const { entries } = await req.json()

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "No journal entries provided." }, { status: 400 })
    }

    const validEntries = entries.filter(
      (e) =>
        typeof e.id === "string" &&
        typeof e.title === "string" &&
        typeof e.description === "string"
    )

    if (validEntries.length === 0) {
      return NextResponse.json({ error: "Invalid journal entry format." }, { status: 400 })
    }

    const entriesToSend = validEntries.slice(0, 50)

    const prompt = `
You are a JSON-only generator for a stress score analyzer. Given journal entries, output a raw JSON array like:

[
  { "id": "abc123", "stressScore": 6 },
  { "id": "def456", "stressScore": 2 }
]

DO NOT explain anything.
DO NOT include any text before or after.
DO NOT wrap it in \`\`\`json or markdown blocks.

Each object must include:
- id: the entry's id
- stressScore: an integer from 0 (no stress) to 10 (very stressed)

Analyze only the title and description. Here's the data:
${JSON.stringify(entriesToSend, null, 2)}
`.trim()

    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const raw = await res.text()
    console.log("🧠 Raw OpenRouter response:\n", raw)

    let parsed
    try {
      const data = JSON.parse(raw)
      let content = data?.choices?.[0]?.message?.content ?? "[]"

      // 🧼 Strip Markdown/code block if wrapped
      content = content
        .trim()
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim()

      console.log("🧠 Cleaned AI content:", content)

      parsed = JSON.parse(content)
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err)
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 })
    }

    const analyzedEntries = Array.isArray(parsed)
      ? parsed.filter(
        (e) => typeof e.id === "string" && typeof e.stressScore === "number"
      )
      : []

    if (analyzedEntries.length === 0) {
      return NextResponse.json({ error: "No valid stress scores received." }, { status: 500 })
    }

    const scores = analyzedEntries.map((e) => e.stressScore)
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
    const rounded = Math.round(avg)

    const summary = getStressSummary(rounded)

    console.log("✅ Parsed stress scores:", analyzedEntries)
    console.log("📊 Summary:", summary)

    return NextResponse.json({ analyzedEntries, summary })
  } catch (err) {
    console.error("❌ Internal error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}

function getStressSummary(score: number) {
  if (score <= 2) {
    return {
      level: "Low Stress",
      emoji: "🟢",
      advice: "You're doing great! Keep journaling and staying mindful.",
    }
  } else if (score <= 5) {
    return {
      level: "Moderate Stress",
      emoji: "🟡",
      advice: "Take short breaks and write down your gratitude today.",
    }
  } else if (score <= 7) {
    return {
      level: "High Stress",
      emoji: "🟠",
      advice: "Try deep breathing or journaling before bed.",
    }
  } else {
    return {
      level: "Severe Stress",
      emoji: "🔴",
      advice: "Consider talking to a friend or therapist and get some rest.",
    }
  }
}
