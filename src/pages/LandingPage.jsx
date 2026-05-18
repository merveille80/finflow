import { useState } from 'react'
import './LandingPage.css'

export default function LandingPage({ onEnterApp, theme, onToggleTheme }) {
  const [activeSection, setActiveSection] = useState('hero')

  return (
    <div className={`landing-container animate-fade-in ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* 1. Technological Grid Overlay */}
      <div className="landing-grid-overlay"></div>

      {/* 2. Background Glowing Orbs */}
      <div className="landing-glow-orb orb-orange"></div>
      <div className="landing-glow-orb orb-white"></div>
      <div className="landing-glow-orb orb-gold"></div>

      {/* 3. Floating 3D-like Asset Layout (Recreation of the user's reference image) */}
      <div className="floating-assets-container">
        {/* Floating Lightning Bolt (Top-Left) */}
        <div className="floating-asset asset-lightning">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="3d-lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5100" />
                <stop offset="100%" stopColor="#ffb700" />
              </linearGradient>
              <filter id="3d-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d="M18 2H9l-3 9h5l-3 11 11-11h-5l3-9z" fill="url(#3d-lightning-grad)" filter="url(#3d-glow)" />
          </svg>
        </div>

        {/* Floating Squiggle Graph line (Top) */}
        <div className="floating-asset asset-squiggle">
          <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 15 C 20 0, 40 30, 60 5 C 80 25, 90 10, 100 20" stroke="url(#3d-lightning-grad)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Floating 3D-glowing Dollar Coin (Top-Right) */}
        <div className="floating-asset asset-coin">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="coin-gold" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#ff9900" />
                <stop offset="70%" stopColor="#ff5100" />
                <stop offset="100%" stopColor="#801a00" />
              </radialGradient>
              <linearGradient id="coin-rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff5100" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#coin-gold)" stroke="url(#coin-rim)" strokeWidth="4" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
            <text x="50" y="65" textAnchor="middle" fill="#ffffff" fontSize="42" fontWeight="900" fontFamily="'Outfit', sans-serif" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>$</text>
          </svg>
        </div>

        {/* Floating 3D virtual Credit Card (Bottom-Left) */}
        <div className="floating-asset asset-card">
          <div className="card-inner">
            <div className="card-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 2H9l-3 9h5l-3 11 11-11h-5l3-9z" fill="currentColor" />
              </svg>
              <span>FinFlow</span>
            </div>
            <div className="card-chip"></div>
            <div className="card-number">•••• •••• •••• 8888</div>
            <div className="card-footer">
              <div className="card-holder">MERVEILLE</div>
              <div className="card-brand"></div>
            </div>
          </div>
        </div>

        {/* Floating 3D Savings Target Goal (Bottom-Right) */}
        <div className="floating-asset asset-target">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="target-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#ff5100" />
                <stop offset="80%" stopColor="#1a0000" />
                <stop offset="100%" stopColor="#07070a" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#target-grad)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
            <circle cx="50" cy="50" r="15" fill="#ff5100" />
            {/* Dart */}
            <path d="M75 25 L45 55 M75 25 L85 15 M70 20 L80 30" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M45 55 L40 60 L35 55 Z" fill="#ffb700" />
          </svg>
        </div>
      </div>

      {/* 4. Public Header Navbar */}
      <header className="landing-header glass-card">
        <div className="landing-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
              <path d="M18 2H9l-3 9h5l-3 11 11-11h-5l3-9z" fill="url(#3d-lightning-grad)" />
            </svg>
          </div>
          <h2>Fin<span>Flow</span></h2>
        </div>

        <nav className="landing-nav">
          <a href="#features" onClick={() => setActiveSection('features')}>Fonctionnalités</a>
          <a href="#security" onClick={() => setActiveSection('security')}>Sécurité</a>
          <a href="#details" onClick={() => setActiveSection('details')}>Spécifications</a>
        </nav>

        <div className="landing-header-actions">
          {/* Theme switcher switch */}
          <button 
            type="button" 
            className="theme-switcher-btn" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sun-icon">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon Icon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-icon">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <button 
            type="button" 
            className="btn-connexion-pill" 
            onClick={() => onEnterApp(false)}
          >
            Connexion
          </button>
        </div>
      </header>

      {/* 5. Hero Central Section (Layout match with user's image) */}
      <section className="landing-hero-section">
        <div className="hero-pill-category">
          <span>FinFlow Platform</span>
        </div>

        <h1 className="hero-main-title">
          Le pouvoir de la clarté <br />
          <span>dans votre design financier</span>
        </h1>

        <p className="hero-sub-description">
          Comment une gestion budgétaire épurée et visuelle transforme votre vision, votre maîtrise <br />
          et l'expansion de votre capital au quotidien. Entièrement sécurisé en local.
        </p>

        <div className="hero-cta-btn-wrapper">
          <button 
            type="button" 
            className="btn-hero-cta" 
            onClick={() => onEnterApp(true)}
          >
            Commencer l'expérience →
          </button>
        </div>
      </section>

      {/* 6. FinFlow Technical Details / Features Section */}
      <section id="features" className="landing-features-section">
        <div className="section-title-wrapper">
          <span className="section-subtitle">CONÇU POUR L'ÉLITE</span>
          <h2 className="section-title">Une ingénierie locale de pointe</h2>
        </div>

        <div className="features-grid">
          {/* Card 1: Multi-devises */}
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <h3>Multi-Devises Natif</h3>
            <p>Créez des portefeuilles en USD, EUR, GBP et JPY. Les conversions se font en temps réel grâce à une interconnexion directe d'API mondiales, avec sauvegarde statique de secours.</p>
          </div>

          {/* Card 2: Cryptographie PBKDF2 */}
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Sécurité Chiffrée PBKDF2</h3>
            <p>Vos mots de passe ne quittent jamais votre machine. Ils sont hachés de manière asymétrique via l'algorithme cryptographique robuste PBKDF2 avec signature HMAC-SHA-512.</p>
          </div>

          {/* Card 3: Graphiques SVG Riches */}
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3>Graphes Vectoriels Réactifs</h3>
            <p>Visualisez instantanément vos flux mensuels grâce à une courbe SVG dynamique, dotée de nœuds interactifs, d'infobulles de survol réactives et de dégradés néon élégants.</p>
          </div>

          {/* Card 4: SQLite Relationnel */}
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/>
              </svg>
            </div>
            <h3>Cascade Relationnelle</h3>
            <p>Bénéficiez d'une base de données SQLite locale structurée. En cas de suppression de profil, le système déclenche en cascade le nettoyage total et irréversible de toutes vos données.</p>
          </div>
        </div>
      </section>

      {/* 7. Security Banner */}
      <section id="security" className="landing-quote-section">
        <div className="quote-card glass-card">
          <p>"La simplicité visuelle est la sophistication suprême dans la gestion de votre richesse."</p>
          <span>— L'Équipe FinFlow</span>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="landing-footer-banner">
        <div className="footer-logo">
          <div className="logo-icon-sm">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '14px' }}>
              <path d="M18 2H9l-3 9h5l-3 11 11-11h-5l3-9z" fill="url(#3d-lightning-grad)" />
            </svg>
          </div>
          <span>FinFlow</span>
        </div>
        <p className="footer-copyright">FinFlow © 2026. L'indépendance financière locale, sécurisée et intelligente.</p>
      </footer>
    </div>
  )
}
