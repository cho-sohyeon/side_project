import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FF6699']

function CategoryChart({ categorySummaries }) {
  if (categorySummaries.length === 0) {
    return <p>표시할 카테고리별 데이터가 없습니다.</p>
  }

  return (
    <div>
      <h4>카테고리별 합계</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categorySummaries}
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ category, ratio }) => `${category} ${ratio}%`}
          >
            {categorySummaries.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
