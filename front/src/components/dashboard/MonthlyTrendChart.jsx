import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function MonthlyTrendChart({ monthlySummaries }) {
  if (monthlySummaries.length === 0) {
    return <p>표시할 월별 데이터가 없습니다.</p>
  }

  return (
    <div>
      <h4>월별 추이</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlySummaries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearMonth" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalAmount" stroke="#E6A200" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendChart
