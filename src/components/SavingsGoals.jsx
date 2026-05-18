import './SavingsGoals.css'

export default function SavingsGoals({ goals, onUpdate, onDelete, onAdd }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Objectifs d'Épargne</div>
        <div className="card-action" onClick={onAdd}>+ Ajouter</div>
      </div>
      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>Aucun objectif</div>
      ) : (
        goals.map((goal) => {
          const percentage = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
          return (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <span className="goal-name">{goal.emoji} {goal.name}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="goal-percentage">{percentage}%</span>
                  <button className="goal-delete-btn" onClick={() => onDelete(goal.id)}>×</button>
                </div>
              </div>
              <div className="goal-bar">
                <div className={`goal-progress ${goal.color}`} style={{ width: percentage + '%' }}></div>
              </div>
              <div className="goal-amounts">
                <span>${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}</span>
                <button className="goal-add-btn" onClick={() => onUpdate(goal.id, { current_amount: goal.current_amount + 100, target_amount: goal.target_amount })}>+ $100</button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
