import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatWon } from '../../utils/format'

const COLORS = ['#FFB627', '#E6A200', '#7A5200', '#FFD98A', '#5C3D00', '#F2C464', '#B8860B']

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
          <Tooltip formatter={(value) => formatWon(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
