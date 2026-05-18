import './RecentTransactions.css'

const icons = {
  income: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  expense: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  transfer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
}

const statusLabels = { completed: 'Complété', pending: 'En cours', failed: 'Échoué' }

export default function RecentTransactions({ transactions, onDelete, onAdd }) {
  const list = transactions.slice(0, 5)

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Activités Récentes</div>
        <div className="card-action" onClick={onAdd}>+ Ajouter</div>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>Aucune transaction</div>
      ) : (
        <div className="transactions-list">
          {list.map((t) => (
            <div key={t.id} className="transaction-item">
              <div className={`transaction-icon ${t.type}`}>{icons[t.type]}</div>
              <div className="transaction-details">
                <div className="transaction-name">{t.description || t.category}</div>
                <div className="transaction-date">{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
              <div className="transaction-amount">
                <div className={`value ${t.type === 'income' ? 'positive' : 'negative'}`}>
                  {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </div>
                <span className={`transaction-status status-${t.status}`}>{statusLabels[t.status]}</span>
              </div>
              <button className="delete-btn" onClick={() => onDelete(t.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
