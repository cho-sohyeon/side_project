import { useEffect, useState } from 'react'
import Home from './components/home/Home'
import ExpenseForm from './components/expense/ExpenseForm'
import ExpenseAnalysisPreview from './components/expense/ExpenseAnalysisPreview'
import ExpenseList from './components/expense/ExpenseList'
import BankCsvImport from './components/expense/BankCsvImport'
import Dashboard from './components/dashboard/Dashboard'
import ProfileView from './components/profile/ProfileView'
import ProfileRegisterForm from './components/profile/ProfileRegisterForm'
import BudgetGoalForm from './components/trend/BudgetGoalForm'
import SavingsSummary from './components/trend/SavingsSummary'
import TrendGuide from './components/trend/TrendGuide'
import StepNav from './components/layout/StepNav'
import AuthGate from './components/auth/AuthGate'
import { getExpenses } from './api/expenseApi'
import { getProfile } from './api/profileApi'
import { logout as logoutApi } from './api/authApi'
import { getToken } from './api/httpClient'
import { generateDueRecurringExpenses } from './api/recurringExpenseApi'
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
  // 'loading' | 'auth'(로그인 필요) | 'onboarding'(로그인은 됐지만 프로필 미등록) | 'active'
  const [sessionState, setSessionState] = useState('loading')

  async function refreshExpenses() {
    const data = await getExpenses()
    setExpenses(data)
  }

  function checkSession() {
    if (!getToken()) {
      setSessionState('auth')
      return
    }
    getProfile()
      .then((res) => {
        setSessionState(res.registered ? 'active' : 'onboarding')
        if (res.registered) {
          generateDueRecurringExpenses()
            .catch(() => {})
            .finally(refreshExpenses)
        }
      })
      .catch(() => setSessionState('auth'))
  }

  useEffect(() => {
    checkSession()
    function handleUnauthorized() {
      setSessionState('auth')
    }
    window.addEventListener('trendledger:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('trendledger:unauthorized', handleUnauthorized)
  }, [])

  function handleAuthenticated() {
    checkSession()
  }

  function handleOnboarded() {
    setSessionState('active')
    refreshExpenses()
  }

  async function handleLogout() {
    await logoutApi()
    setStepIndex(0)
    setSessionState('auth')
  }

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

  if (sessionState === 'loading') {
    return (
      <div className="app-shell">
        <div className="app-frame" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <p className="muted">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (sessionState === 'auth') {
    return <AuthGate onAuthenticated={handleAuthenticated} />
  }

  if (sessionState === 'onboarding') {
    return (
      <div className="app-shell">
        <div className="app-frame">
          <header className="app-header">
            <span className="brand">🐷 TrendLedger</span>
          </header>
          <section id="center">
            <div className="section">
              <div className="card" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '40px', margin: '0 0 8px' }}>🐷</p>
                <h2 style={{ margin: '0 0 4px' }}>TrendLedger에 오신 걸 환영해요</h2>
                <p className="muted" style={{ margin: 0 }}>
                  맞춤 가이드를 위해 먼저 프로필을 등록해주세요
                </p>
              </div>
              <ProfileRegisterForm mode="register" onSaved={handleOnboarded} />
            </div>
          </section>
        </div>
      </div>
    )
  }

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

          {currentStep === 'profile' && <ProfileView onLogout={handleLogout} />}

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
