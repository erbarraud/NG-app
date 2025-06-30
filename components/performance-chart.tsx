import type React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface PerformanceData {
  name: string
  value: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  xAxisKey: string
  yAxisKey: string
  barColor: string
  chartTitle?: string
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, xAxisKey, yAxisKey, barColor, chartTitle }) => {
  return (
    <div>
      {chartTitle && <h3>{chartTitle}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey={yAxisKey} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart
