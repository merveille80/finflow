import { useState } from 'react'

export default function HelpPage() {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqItems = [
    {
      q: "Comment fonctionne l'échangeur et le convertisseur de devises ?",
      a: "FinFlow propose un module d'échange de devises réel connecté à vos portefeuilles actifs. Lors d'un échange, l'application vérifie d'abord que le portefeuille source possède un solde suffisant. Elle applique ensuite le taux de conversion en vigueur pour débiter le montant du portefeuille source et créditer le montant équivalent converti sur le portefeuille cible."
    },
    {
      q: "Mes informations et mots de passe sont-ils en sécurité ?",
      a: "Absolument. FinFlow n'enregistre jamais vos mots de passe en clair. Vos identifiants de connexion sont protégés à l'aide de l'algorithme robuste de chiffrement PBKDF2 avec signature HMAC-SHA-512 et salt dynamique de 16 octets. Les données financières sont quant à elles hébergées dans un serveur de base de données relationnelle SQLite sécurisé en local."
    },
    {
      q: "Comment créer un nouvel objectif d'épargne (Savings Goals) ?",
      a: "Rendez-vous sur le tableau de bord principal. Dans le panneau de droite 'Objectifs d'Épargne', cliquez sur le bouton '+'. Vous pourrez définir un titre personnalisé (ex: Voyage au Japon), un montant cible à atteindre, un emoji et une couleur d'accentuation. Vous pourrez ensuite y ajouter des fonds d'un simple clic."
    },
    {
      q: "Puis-je gérer des portefeuilles dans différentes devises ?",
      a: "Oui ! FinFlow prend entièrement en charge le multi-devises natif. Vous pouvez créer autant de portefeuilles que vous le désirez en USD ($), EUR (€), GBP (£), ou JPY (¥). Le solde cumulé est ensuite automatiquement converti et totalisé en temps réel sur votre tableau de bord."
    },
    {
      q: "Comment fonctionne la suppression en cascade de mon compte ?",
      a: "Si vous décidez de supprimer votre profil depuis l'onglet Paramètres, notre base de données applique la contrainte relationnelle ON DELETE CASCADE. L'intégralité de vos portefeuilles, transactions enregistrées, cartes bancaires enregistrées, bénéficiaires et objectifs d'épargne associés à votre ID utilisateur sera supprimée de manière définitive et sécurisée pour garantir la confidentialité totale de votre vie privée."
    }
  ]

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <span className="page-subtitle">Assistance et documentation</span>
          <h1 className="page-title">Centre d'Aide & FAQ</h1>
        </div>
      </div>

      <div className="help-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginTop: '24px' }}>
        
        {/* Accordion FAQ Card */}
        <div className="card glass-card">
          <div className="card-header" style={{ marginBottom: '24px' }}>
            <h3>Questions Fréquentes</h3>
            <p className="card-desc">Toutes les réponses pour maîtriser FinFlow comme un professionnel.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqItems.map((item, idx) => {
              const isOpen = activeIndex === idx
              return (
                <div 
                  key={idx} 
                  className="faq-item"
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    background: isOpen ? 'var(--bg-secondary)' : 'transparent',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Accordion Trigger */}
                  <button 
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '14.5px',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b00'}
                    onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.color = 'var(--text-primary)' }}
                  >
                    <span>{item.q}</span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.3s ease',
                        color: isOpen ? '#ff6b00' : 'var(--text-light)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Accordion Panel Body */}
                  <div 
                    style={{
                      maxHeight: isOpen ? '200px' : '0',
                      opacity: isOpen ? '1' : '0',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                      borderTop: isOpen ? '1px solid var(--border)' : 'none'
                    }}
                  >
                    <p style={{
                      padding: '20px',
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Support contacts block */}
        <div className="card glass-card">
          <div className="card-header" style={{ marginBottom: '24px' }}>
            <h3>Assistance Technique</h3>
            <p className="card-desc">Vous n'avez pas trouvé de réponse ? Notre équipe de support vous répond en moins de 24h.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            
            {/* Email Support Card */}
            <div style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              <div style={{ color: '#ff6b00' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px' }}>Support E-mail</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-light)', lineHeight: '1.5' }}>
                Écrivez-nous à tout moment. Réponse sous 24 heures ouvrées garantie.
              </p>
              <a href="mailto:support@finflow.db" style={{ color: '#ff6b00', fontSize: '13px', fontWeight: '700', textDecoration: 'none', marginTop: 'auto' }}>
                support@finflow.db →
              </a>
            </div>

            {/* Chat Support Card */}
            <div style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              <div style={{ color: '#3b82f6' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px' }}>Chat en direct</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-light)', lineHeight: '1.5' }}>
                Discutez en direct avec un conseiller depuis votre espace client.
              </p>
              <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: 'auto' }}>
                Lancer le chat →
              </span>
            </div>

            {/* Call Support Card */}
            <div style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              <div style={{ color: '#10b981' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px' }}>Support Téléphonique</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-light)', lineHeight: '1.5' }}>
                Disponible du lundi au vendredi de 9h à 18h pour les urgences.
              </p>
              <a href="tel:+33123456789" style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', textDecoration: 'none', marginTop: 'auto' }}>
                +33 1 23 45 67 89 →
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
