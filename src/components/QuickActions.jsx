import './QuickActions.css'

const actions = [
  { id: 'deposit', label: 'Déposer', icon: 'deposit' },
  { id: 'transfer', label: 'Transférer', icon: 'transfer' },
  { id: 'exchange', label: 'Échanger', icon: 'exchange' },
  { id: 'pay', label: 'Payer', icon: 'pay' },
]

const icons = {
  deposit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  transfer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  exchange: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  pay: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
}

export default function QuickActions({ activeAction, setActiveAction, onAction }) {
  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.id}
          className={`quick-action-btn ${activeAction === action.id ? 'active' : ''}`}
          onClick={() => { setActiveAction(action.id); onAction(action.id) }}
        >
          {icons[action.icon]}
          {action.label}
        </button>
      ))}
    </div>
  )
}
