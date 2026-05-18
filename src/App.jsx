import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatsGrid from './components/StatsGrid'
import VolumeChart from './components/VolumeChart'
import CurrencyConverter from './components/CurrencyConverter'
import RecentTransactions from './components/RecentTransactions'
import SavingsGoals from './components/SavingsGoals'
import Modal from './components/Modal'
import WalletsPage from './pages/WalletsPage'
import TransactionsPage from './pages/TransactionsPage'
import BeneficiariesPage from './pages/BeneficiariesPage'
import CardsPage from './pages/CardsPage'
import InvoicesPage from './pages/InvoicesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LoginScreen from './pages/LoginScreen'
import SettingsPage from './pages/SettingsPage'
import HistoryPage from './pages/HistoryPage'
import HelpPage from './pages/HelpPage'
import TontinesPage from './pages/TontinesPage'
import LandingPage from './pages/LandingPage'
import './App.css'

const API = 'http://127.0.0.1:3001/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [theme, setTheme] = useState(localStorage.getItem('finflow_theme') || 'dark')
  const [showAuth, setShowAuth] = useState(false)
  const [isRegisterInitial, setIsRegisterInitial] = useState(false)
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [beneficiaries, setBeneficiaries] = useState([])
  const [goals, setGoals] = useState([])
  const [cards, setCards] = useState([])
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState({ totalBalance: 0, income: 0, expense: 0, monthlyVolume: 0 })
  const [modal, setModal] = useState(null)

  // Sync theme class to document.body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
  }, [theme])

  // Initialize session from localStorage
  useEffect(() => {
    const cachedUser = localStorage.getItem('finflow_user')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
    }
  }, [])

  const fetchData = async () => {
    if (!user) return
    try {
      const [walletsRes, txsRes, beneficiariesRes, goalsRes, cardsRes, invoicesRes, statsRes] = await Promise.all([
        fetch(`${API}/wallets?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/transactions?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/beneficiaries?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/goals?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/cards?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/invoices?user_id=${user.id}`).then(r => r.json()),
        fetch(`${API}/stats?user_id=${user.id}`).then(r => r.json()),
      ])
      setWallets(walletsRes)
      setTransactions(txsRes)
      setBeneficiaries(beneficiariesRes)
      setGoals(goalsRes)
      setCards(cardsRes)
      setInvoices(invoicesRes)
      setStats(statsRes)
    } catch (e) {
      console.error('Error fetching data:', e)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const addWallet = async (data) => {
    if (!user) return
    await fetch(`${API}/wallets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id: user.id })
    })
    fetchData()
    setModal(null)
  }

  const deleteWallet = async (id) => {
    await fetch(`${API}/wallets/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addTransaction = async (data) => {
    if (!user) return
    await fetch(`${API}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    fetchData()
    setModal(null)
  }

  const deleteTransaction = async (id) => {
    await fetch(`${API}/transactions/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addBeneficiary = async (data) => {
    if (!user) return
    await fetch(`${API}/beneficiaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id: user.id })
    })
    fetchData()
    setModal(null)
  }

  const deleteBeneficiary = async (id) => {
    await fetch(`${API}/beneficiaries/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addGoal = async (data) => {
    if (!user) return
    await fetch(`${API}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id: user.id })
    })
    fetchData()
    setModal(null)
  }

  const updateGoal = async (id, current, target) => {
    await fetch(`${API}/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_amount: current, target_amount: target })
    })
    fetchData()
  }

  const deleteGoal = async (id) => {
    await fetch(`${API}/goals/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addCard = async (data) => {
    if (!user) return
    await fetch(`${API}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id: user.id })
    })
    fetchData()
    setModal(null)
  }

  const deleteCard = async (id) => {
    await fetch(`${API}/cards/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addInvoice = async (data) => {
    if (!user) return
    await fetch(`${API}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id: user.id })
    })
    fetchData()
    setModal(null)
  }

  const updateInvoice = async (id, status) => {
    await fetch(`${API}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchData()
  }

  const deleteInvoice = async (id) => {
    await fetch(`${API}/invoices/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const handleLogout = () => {
    localStorage.removeItem('finflow_user')
    setUser(null)
    setWallets([])
    setTransactions([])
    setBeneficiaries([])
    setGoals([])
    setCards([])
    setInvoices([])
    setStats({ totalBalance: 0, income: 0, expense: 0, monthlyVolume: 0 })
    setActiveNav('dashboard')
    setShowAuth(false)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('finflow_theme', newTheme)
  }

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            <StatsGrid stats={stats} wallets={wallets} />
            <div className="content-grid">
              <VolumeChart transactions={transactions} />
              <CurrencyConverter wallets={wallets} onAddTransaction={addTransaction} />
            </div>
            <div className="bottom-grid">
              <RecentTransactions transactions={transactions} onDelete={deleteTransaction} onAdd={() => setModal({ type: 'transaction' })} />
              <SavingsGoals goals={goals} onUpdate={updateGoal} onDelete={deleteGoal} onAdd={() => setModal({ type: 'goal' })} />
            </div>
          </>
        )
      case 'wallets':
        return <WalletsPage wallets={wallets} onAdd={() => setModal({ type: 'wallet' })} onDelete={deleteWallet} />
      case 'transactions':
        return <TransactionsPage transactions={transactions} wallets={wallets} onAdd={() => setModal({ type: 'transaction' })} onDelete={deleteTransaction} />
      case 'beneficiaries':
        return <BeneficiariesPage beneficiaries={beneficiaries} onAdd={() => setModal({ type: 'beneficiary' })} onDelete={deleteBeneficiary} />
      case 'cards':
        return <CardsPage cards={cards} onAdd={() => setModal({ type: 'card' })} onDelete={deleteCard} />
      case 'invoices':
        return <InvoicesPage invoices={invoices} onAdd={() => setModal({ type: 'invoice' })} onUpdate={updateInvoice} onDelete={deleteInvoice} />
      case 'analytics':
        return <AnalyticsPage transactions={transactions} wallets={wallets} />
      case 'tontines':
        return <TontinesPage user={user} />
      case 'history':
        return <HistoryPage transactions={transactions} wallets={wallets} />
      case 'settings':
        return <SettingsPage user={user} onProfileUpdate={setUser} onLogout={handleLogout} />
      case 'help':
        return <HelpPage />
      default:
        return <div className="card" style={{ textAlign: 'center', padding: '60px' }}><h2>Page en construction</h2></div>
    }
  }

  // Render auth or landing page if logged out
  if (!user) {
    if (showAuth) {
      return (
        <LoginScreen 
          onLoginSuccess={setUser} 
          onBackToHome={() => setShowAuth(false)} 
          initialRegister={isRegisterInitial} 
        />
      )
    }
    return (
      <LandingPage 
        onEnterApp={(reg) => {
          setIsRegisterInitial(reg)
          setShowAuth(true)
        }} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />
    )
  }

  return (
    <div className="app-container">
      <Sidebar 
        active={activeNav} 
        onChange={setActiveNav} 
        user={user} 
        onLogout={handleLogout} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="main-content">
        <Header user={user} activeNav={activeNav} onAdd={() => setModal({ type: 'transaction' })} />
        <div className="content-container">
          {renderPage()}
        </div>
      </div>

      {modal && (
        <Modal
          modal={modal}
          wallets={wallets}
          beneficiaries={beneficiaries}
          onSubmit={
            modal.type === 'wallet' ? addWallet :
            modal.type === 'transaction' ? addTransaction :
            modal.type === 'beneficiary' ? addBeneficiary :
            modal.type === 'goal' ? addGoal :
            modal.type === 'card' ? addCard :
            addInvoice
          }
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
