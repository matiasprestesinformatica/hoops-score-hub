"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  ChartConfig,
} from "@/components/ui/chart"

interface PlayerPerformanceChartProps {
    data: { 
        partido: string;
        puntos: number;
        rebotes: number;
        asistencias: number;
    }[];
}

const chartConfig = {
  puntos: {
    label: "Puntos",
    color: "hsl(var(--primary))",
  },
  rebotes: {
    label: "Rebotes",
    color: "hsl(var(--foreground))",
  },
  asistencias: {
    label: "Asistencias",
    color: "hsl(var(--secondary-foreground))",
  },
} satisfies ChartConfig

export function PlayerPerformanceChart({ data }: PlayerPerformanceChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Rendimiento por Partido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                        dataKey="partido"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent))' }}
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="puntos" stroke={chartConfig.puntos.color} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rebotes" stroke={chartConfig.rebotes.color} />
                    <Line type="monotone" dataKey="asistencias" stroke={chartConfig.asistencias.color} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
