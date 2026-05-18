import './Header.css'

export default function Header({ user, activeNav = 'dashboard', onAdd }) {
  const getHeaderMeta = () => {
    const name = user ? user.name : 'Marc Antoine'
    switch (activeNav) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          desc: `Bienvenue, ${name}. Voici un aperçu de vos finances.`
        }
      case 'wallets':
        return {
          title: 'Portefeuilles',
          desc: 'Gérez vos comptes et vos liquidités multi-devises.'
        }
      case 'cards':
        return {
          title: 'Cartes Virtuelles',
          desc: 'Vos cartes de crédit virtuelles prêtes pour vos paiements sécurisés.'
        }
      case 'transactions':
        return {
          title: 'Transactions',
          desc: 'Enregistrez vos revenus, vos dépenses ou vos transferts.'
        }
      case 'history':
        return {
          title: "Fil d'Historique",
          desc: "Piste d'audit complète de vos entrées et sorties de fonds."
        }
      case 'beneficiaries':
        return {
          title: 'Bénéficiaires',
          desc: 'Gérez vos contacts et vos comptes externes de transfert.'
        }
      case 'analytics':
        return {
          title: 'Budgets & Analyses',
          desc: 'Suivez vos dépenses par rapport à vos objectifs budgétaires.'
        }
      case 'settings':
        return {
          title: 'Paramètres',
          desc: 'Personnalisez vos préférences de sécurité et profil.'
        }
      case 'help':
        return {
          title: "Centre d'Aide",
          desc: "Consultez notre FAQ ou contactez l'assistance technique."
        }
      case 'tontines':
        return {
          title: 'Cercles de Tontine 🤝',
          desc: 'Gérez vos groupes d\'épargne communautaire et suivez les tours de passage.'
        }
      case 'invoices':
        return {
          title: 'Factures & Devis',
          desc: 'Créez, suivez et exportez vos factures clients en PDF.'
        }
      default:
        return {
          title: 'Dashboard',
          desc: `Bienvenue, ${name}. Voici un aperçu de vos finances.`
        }
    }
  }

  const { title, desc } = getHeaderMeta()

  return (
    <div className="header">
      <div className="header-title">
        <h1 style={{ color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
      <div className="header-actions">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Rechercher..." />
        </div>
        <button className="btn btn-secondary icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span className="notification-dot"></span>
        </button>
        <button className="btn btn-primary" onClick={onAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nouveau
        </button>
      </div>
    </div>
  )
}
