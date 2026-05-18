import './Pages.css'

const currencyMap = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' }

export default function WalletsPage({ wallets, onAdd, onDelete }) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>Portefeuilles</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouveau Portefeuille</button>
      </div>
      <div className="cards-grid">
        {wallets.map(w => (
          <div key={w.id} className="wallet-card">
            <div className="wallet-header">
              <div className="wallet-name">{w.name}</div>
              <button className="delete-btn" onClick={() => onDelete(w.id)}>×</button>
            </div>
            <div className="wallet-balance">{currencyMap[w.currency] || '$'}{w.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="wallet-currency">{w.currency}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
