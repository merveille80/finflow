import { useState } from 'react'
import './LoginScreen.css'

const API = 'http://127.0.0.1:3001/api'

export default function LoginScreen({ onLoginSuccess, onBackToHome, initialRegister }) {
  const [isRegister, setIsRegister] = useState(initialRegister || false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = isRegister ? `${API}/auth/register` : `${API}/auth/login`
    const payload = isRegister ? { name, email, password } : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      // Store in localStorage for persistent session
      localStorage.setItem('finflow_user', JSON.stringify(data))
      onLoginSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Dynamic Background Glowing Orbs */}
      <div className="login-glow-orb orb-1"></div>
      <div className="login-glow-orb orb-2"></div>
      <div className="login-glow-orb orb-3"></div>
      
      {/* Tech Grid Overlay */}
      <div className="login-grid-overlay"></div>

      <div className="login-glass-card">
        {/* Subtle top ambient bar */}
        <div className="card-top-accent"></div>

        {onBackToHome && (
          <button 
            type="button" 
            className="btn-back-home" 
            onClick={onBackToHome}
            title="Retourner à l'accueil"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Retour</span>
          </button>
        )}

        <div className="login-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '26px', height: '26px' }}>
              <defs>
                <linearGradient id="login-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff5100" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <path d="M18 2H9l-3 9h5l-3 11 11-11h-5l3-9z" fill="url(#login-logo-grad)" />
            </svg>
          </div>
          <h2>Fin<span>Flow</span></h2>
        </div>

        {/* Premium Sliding Pill Switcher */}
        <div className="login-tab-switcher">
          <div 
            className={`tab-slider ${isRegister ? 'register-active' : 'login-active'}`}
          ></div>
          <button 
            type="button"
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setError(''); }}
          >
            Connexion
          </button>
          <button 
            type="button"
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setError(''); }}
          >
            Inscription
          </button>
        </div>

        <div className="login-header">
          <h3>{isRegister ? 'Rejoignez FinFlow' : 'Ravi de vous revoir'}</h3>
          <p>{isRegister ? 'Créez un compte et prenez le contrôle de vos finances en quelques secondes.' : 'Connectez-vous pour accéder à vos portefeuilles et analyses.'}</p>
        </div>

        {error && (
          <div className="login-error-toast animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="login-input-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="login-input-group">
            <label>Adresse E-mail</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                placeholder="jean.dupont@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="login-btn-submit" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loader">
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Chargement...
              </span>
            ) : isRegister ? (
              "Créer mon compte"
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="login-switch-mode">
          {isRegister ? (
            <p>Déjà membre de FinFlow ? <span onClick={() => { setIsRegister(false); setError(''); }}>Se connecter</span></p>
          ) : (
            <p>Nouveau sur FinFlow ? <span onClick={() => { setIsRegister(true); setError(''); }}>Créer un compte gratuit</span></p>
          )}
        </div>
      </div>
    </div>
  )
}
