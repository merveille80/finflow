import './Pages.css'

export default function BeneficiariesPage({ beneficiaries, onAdd, onDelete }) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>Bénéficiaires</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouveau Bénéficiaire</button>
      </div>
      <div className="cards-grid">
        {beneficiaries.map(b => (
          <div key={b.id} className="beneficiary-card">
            <div className="beneficiary-header">
              <div className="beneficiary-avatar">{b.name.charAt(0)}</div>
              <button className="delete-btn" onClick={() => onDelete(b.id)}>×</button>
            </div>
            <div className="beneficiary-name">{b.name}</div>
            <div className="beneficiary-email">{b.email || 'Pas d\'email'}</div>
            <div className="beneficiary-bank">{b.bank || 'Banque non spécifiée'}</div>
            {b.account_number && <div className="beneficiary-account">{b.account_number}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
