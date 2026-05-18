import './Pages.css'

const icons = {
  income: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  expense: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  transfer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
}

const statusLabels = { completed: 'Complété', pending: 'En cours', failed: 'Échoué' }

export default function TransactionsPage({ transactions, wallets, onAdd, onDelete }) {
  const walletMap = {}
  wallets.forEach(w => walletMap[w.id] = w.name)

  return (
    <div className="page">
      <div className="page-header">
        <h2>Transactions</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouvelle Transaction</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Portefeuille</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td><div className={`transaction-icon ${t.type}`} style={{ width: 32, height: 32 }}>{icons[t.type]}</div></td>
                <td>{t.description || t.category}</td>
                <td>{walletMap[t.wallet_id] || '-'}</td>
                <td className={t.type === 'income' ? 'positive' : 'negative'}>
                  {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </td>
                <td><span className={`transaction-status status-${t.status}`}>{statusLabels[t.status]}</span></td>
                <td>{new Date(t.created_at).toLocaleDateString('fr-FR')}</td>
                <td><button className="delete-btn" onClick={() => onDelete(t.id)}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
