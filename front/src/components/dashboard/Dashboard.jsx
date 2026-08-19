import { useEffect, useState } from 'react'
import StatFilterForm from './StatFilterForm'
import CategoryChart from './CategoryChart'
import MonthlyTrendChart from './MonthlyTrendChart'
import FilterPresetForm from './FilterPresetForm'
import FilterPresetList from './FilterPresetList'
import { getExpenseStats, getPresets } from '../../api/expenseApi'

function Dashboard() {
  const [filter, setFilter] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [presets, setPresets] = useState([])

  async function refreshPresets() {
    const data = await getPresets()
    setPresets(data)
  }

  useEffect(() => {
    refreshPresets()
  }, [])

  async function handleSearch(nextFilter) {
    setFilter(nextFilter)
    setError(null)
    try {
      const result = await getExpenseStats(nextFilter)
      setStats(result)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section>
      <h2>소비 패턴 대시보드</h2>
      <StatFilterForm
        key={JSON.stringify(filter)}
        initialFilter={filter}
        onSearch={handleSearch}
      />
      <FilterPresetForm currentFilter={filter} onSaved={refreshPresets} />
      <FilterPresetList presets={presets} onSelect={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stats && (
        <div>
          <CategoryChart categorySummaries={stats.categorySummaries} />
          <MonthlyTrendChart monthlySummaries={stats.monthlySummaries} />
        </div>
      )}
    </section>
  )
}

export default Dashboard
