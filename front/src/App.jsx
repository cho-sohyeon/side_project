import { useEffect, useState } from 'react'
import Home from './components/home/Home'
import ExpenseForm from './components/expense/ExpenseForm'
import ExpenseAnalysisPreview from './components/expense/ExpenseAnalysisPreview'
import ExpenseList from './components/expense/ExpenseList'
import BankCsvImport from './components/expense/BankCsvImport'
import Dashboard from './components/dashboard/Dashboard'
import ProfileView from './components/profile/ProfileView'
import BudgetGoalForm from './components/trend/BudgetGoalForm'
import SavingsSummary from './components/trend/SavingsSummary'
import TrendGuide from './components/trend/TrendGuide'
import StepNav from './components/layout/StepNav'
import { getExpenses } from './api/expenseApi'
import './App.css'

const STEPS = [
  { key: 'home', label: '홈' },
  { key: 'goal', label: '목표' },
  { key: 'expense', label: '거래입력' },
  { key: 'savings', label: '절약확인' },
  { key: 'trend', label: '투자트렌드' },
  { key: 'profile', label: '프로필' },
]

function App() {
  const [stepIndex, setStepIndex] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [formKey, setFormKey] = useState(0)

  async function refreshExpenses() {
    const data = await getExpenses()
    setExpenses(data)
  }

  useEffect(() => {
    refreshExpenses()
  }, [])

  function handleSaved() {
    setAnalysis(null)
    setFormKey((k) => k + 1)
    refreshExpenses()
  }

  function goToStep(key) {
    const index = STEPS.findIndex((step) => step.key === key)
    if (index >= 0) setStepIndex(index)
  }

  const currentStep = STEPS[stepIndex].key

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="app-header">
          <span
            className="brand"
            role="button"
            tabIndex={0}
            onClick={() => goToStep('home')}
            style={{ cursor: 'pointer' }}
          >
            🐷 TrendLedger
          </span>
          <h1>{STEPS[stepIndex].label}</h1>
        </header>

        <section id="center">
          {currentStep === 'home' && <Home onNavigate={goToStep} />}

          {currentStep === 'profile' && <ProfileView />}

          {currentStep === 'goal' && <BudgetGoalForm />}

          {currentStep === 'expense' && (
            <>
              <ExpenseForm key={formKey} onAnalyzed={setAnalysis} onSaved={handleSaved} />
              {analysis && (
                <ExpenseAnalysisPreview analysis={analysis} onSaved={handleSaved} />
              )}
              <BankCsvImport onImported={refreshExpenses} />
              <ExpenseList expenses={expenses} onChanged={refreshExpenses} />
            </>
          )}

          {currentStep === 'savings' && (
            <>
              <SavingsSummary />
              <Dashboard />
            </>
          )}

          {currentStep === 'trend' && (
            <TrendGuide onGoToProfile={() => goToStep('profile')} />
          )}
        </section>

        <StepNav steps={STEPS} currentIndex={stepIndex} onSelect={setStepIndex} />
      </div>
    </div>
  )
}

export default App
