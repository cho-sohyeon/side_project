import { useEffect, useState } from 'react'
import ExpenseForm from './components/expense/ExpenseForm'
import ExpenseAnalysisPreview from './components/expense/ExpenseAnalysisPreview'
import ExpenseList from './components/expense/ExpenseList'
import Dashboard from './components/dashboard/Dashboard'
import ProfileView from './components/profile/ProfileView'
import TrendGuide from './components/trend/TrendGuide'
import { getExpenses } from './api/expenseApi'
import './App.css'

function App() {
  const [analysis, setAnalysis] = useState(null)
  const [expenses, setExpenses] = useState([])

  async function refreshExpenses() {
    const data = await getExpenses()
    setExpenses(data)
  }

  useEffect(() => {
    refreshExpenses()
  }, [])

  function handleSaved() {
    setAnalysis(null)
    refreshExpenses()
  }

  return (
    <section id="center">
      <div id="profile-section">
        <ProfileView />
      </div>
      <ExpenseForm onAnalyzed={setAnalysis} />
      {analysis && (
        <ExpenseAnalysisPreview analysis={analysis} onSaved={handleSaved} />
      )}
      <ExpenseList expenses={expenses} />
      <Dashboard />
      <TrendGuide />
    </section>
  )
}

export default App
