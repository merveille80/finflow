import './Pages.css'

const typeLabels = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' }

export default function CardsPage({ cards, onAdd, onDelete }) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>Cartes</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouvelle Carte</button>
      </div>
      <div className="cards-grid">
        {cards.map(c => (
          <div key={c.id} className={`card-visual ${c.type}`}>
            <div className="card-visual-header">
              <span>{typeLabels[c.type]}</span>
              <button className="delete-btn" onClick={() => onDelete(c.id)}>×</button>
            </div>
            <div className="card-number">•••• •••• •••• {c.last_four}</div>
            <div className="card-visual-footer">
              <span>{c.name}</span>
              <span>${c.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
