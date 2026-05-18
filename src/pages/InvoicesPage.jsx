import './Pages.css'

const statusLabels = { paid: 'Payée', pending: 'En attente', overdue: 'En retard' }

export default function InvoicesPage({ invoices, onAdd, onUpdate, onDelete }) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>Factures</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ Nouvelle Facture</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><strong>{inv.number}</strong></td>
                <td>{inv.client}</td>
                <td>${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                  <select
                    className={`status-select status-${inv.status}`}
                    value={inv.status}
                    onChange={e => onUpdate(inv.id, { status: e.target.value })}
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payée</option>
                    <option value="overdue">En retard</option>
                  </select>
                </td>
                <td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString('fr-FR') : '-'}</td>
                <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => {
                      // Ouvre le menu d'impression natif du navigateur pour "Sauvegarder en PDF"
                      window.print()
                    }}
                    title="Imprimer ou Exporter en PDF"
                  >
                    📄 PDF
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(inv.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
