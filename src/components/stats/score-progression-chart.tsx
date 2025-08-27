"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type {
  ChartConfig,
} from "@/components/ui/chart"

interface ScoreProgressionChartProps {
    data: { period: string; [key: string]: number | string }[];
    teamAName: string;
    teamBName: string;
}

export function ScoreProgressionChart({ data, teamAName, teamBName }: ScoreProgressionChartProps) {
  const chartConfig = {
    [teamAName]: {
      label: teamAName,
      color: "hsl(var(--primary))",
    },
    [teamBName]: {
      label: teamBName,
      color: "hsl(var(--foreground))",
    },
  } satisfies ChartConfig

  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--card-foreground))"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={teamAName} stroke={chartConfig[teamAName].color} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey={teamBName} stroke={chartConfig[teamBName].color} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
