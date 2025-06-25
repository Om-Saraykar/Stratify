"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface StressTrendChartProps {
  entries: { date: string; stressScore?: number }[]
}

export function StressTrendChart({ entries }: StressTrendChartProps) {
  const data = entries
    .filter((e) => typeof e.stressScore === "number")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="w-full h-64 p-4 border rounded-xl bg-white dark:bg-muted">
      <h2 className="text-lg font-medium mb-4">🧠 Stress Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="stressScore" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
