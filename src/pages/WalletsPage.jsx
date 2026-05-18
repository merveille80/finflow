import './Pages.css'

const currencyMap = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥',
  XAF: 'FCFA', XOF: 'FCFA', CDF: 'FC', NGN: '₦', ZAR: 'R'
}

const currencyColors = {
  USD: '#10b981', EUR: '#3b82f6', GBP: '#8b5cf6', JPY: '#f59e0b',
  XAF: '#ff6b00', XOF: '#ff6b00', CDF: '#ef4444', NGN: '#22c55e', ZAR: '#06b6d4'
}

export default function WalletsPage({ wallets, onAdd, onDelete }) {
  const total = wallets.reduce((sum, w) => sum + (w.currency === 'USD' ? w.balance : 0), 0)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Portefeuilles</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            {wallets.length} compte{wallets.length > 1 ? 's' : ''} actif{wallets.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouveau Portefeuille</button>
      </div>
      <div className="cards-grid">
        {wallets.length === 0 && (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Aucun portefeuille. Créez-en un pour commencer.</p>
          </div>
        )}
        {wallets.map(w => {
          const symbol = currencyMap[w.currency] || w.currency
          const color = currencyColors[w.currency] || '#ff6b00'
          const isAfricain = ['XAF', 'XOF', 'CDF', 'NGN', 'ZAR'].includes(w.currency)
          return (
            <div key={w.id} className="wallet-card" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Color accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: '16px 16px 0 0' }} />
              <div className="wallet-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color }}>
                    {symbol.length <= 2 ? symbol : w.currency.charAt(0)}
                  </div>
                  <div>
                    <div className="wallet-name">{w.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                      {isAfricain ? '🌍 Devise Africaine' : '🌐 Devise Internationale'}
                    </div>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => onDelete(w.id)}>×</button>
              </div>
              <div className="wallet-balance" style={{ color, marginTop: '16px', fontSize: '26px' }}>
                {isAfricain
                  ? `${w.balance.toLocaleString('fr-FR')} ${symbol}`
                  : `${symbol}${w.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                }
              </div>
              <div className="wallet-currency" style={{ marginTop: '4px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700' }}>
                {w.currency} • Solde disponible
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
