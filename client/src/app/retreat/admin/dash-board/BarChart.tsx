import { Box, Paper, Typography } from "@mui/material"
import { useMemo, useRef, useEffect, useState } from "react"

interface BarChartProps {
  title: string
  data: Record<string, number>
  height?: number
  color?: string
}

export default function BarChart({
  title,
  data,
  height = 300,
  color = "#3B82F6",
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(400)

  const { xAxis, maxValue } = useMemo(() => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    return {
      xAxis: keys,
      maxValue: Math.max(...values, 1),
    }
  }, [data])

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 48) // padding 제외
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)

    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const chartHeight = height - 60
  const chartWidth = containerWidth - 60 // margin 고려

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        m: 1,
        borderRadius: 2,
        width: "100%",
        boxSizing: "border-box",
      }}
      ref={containerRef}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">
        {title}
      </Typography>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${Math.max(
            chartWidth + 60,
            xAxis.length * 60
          )} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1={50}
                y1={20 + chartHeight * ratio}
                x2={Math.max(chartWidth + 50, xAxis.length * 60 + 20)}
                y2={20 + chartHeight * ratio}
                stroke="#E5E5E5"
                strokeWidth={ratio === 1 ? 2 : 1}
              />
              <text
                x={45}
                y={25 + chartHeight * ratio}
                fontSize="12"
                fill="#666"
                textAnchor="end"
              >
                {Math.round(maxValue * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Bars and labels */}
          {xAxis.map((key, index) => {
            const value = data[key] || 0
            const barHeight = (value / maxValue) * chartHeight
            const availableWidth = Math.max(
              chartWidth - 20,
              xAxis.length * 60 - 60
            )
            const barWidth = Math.min(40, (availableWidth / xAxis.length) * 0.8)
            const x = 80 + index * (availableWidth / xAxis.length)

            return (
              <g key={key}>
                {/* Bar */}
                <rect
                  x={x - barWidth / 2}
                  y={20 + chartHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx={2}
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />

                {/* Value label */}
                {value > 0 && (
                  <text
                    x={x}
                    y={15 + chartHeight - barHeight}
                    fontSize="12"
                    fill="#333"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - 15}
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  {key.length > 8 ? key.slice(0, 8) + "..." : key}
                </text>
              </g>
            )
          })}
        </svg>
      </Box>
    </Paper>
  )
}
