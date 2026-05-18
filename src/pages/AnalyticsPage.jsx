import './Pages.css'

export default function AnalyticsPage({ transactions, wallets }) {
  // 1. Calculate general stats
  const incomesList = transactions.filter(t => t.type === 'income' && t.status === 'completed')
  const expensesList = transactions.filter(t => t.type === 'expense' && t.status === 'completed')

  const totalIncome = incomesList.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expensesList.reduce((sum, t) => sum + t.amount, 0)
  const savings = Math.max(0, totalIncome - totalExpense)
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  // 2. Group expenses by category
  const expenseByCategory = {}
  expensesList.forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
  })

  const expenseCategories = Object.keys(expenseByCategory).map(cat => ({
    name: cat,
    amount: expenseByCategory[cat],
    percentage: totalExpense > 0 ? Math.round((expenseByCategory[cat] / totalExpense) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)

  // 3. Group income by category
  const incomeByCategory = {}
  incomesList.forEach(t => {
    incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
  })

  const incomeCategories = Object.keys(incomeByCategory).map(cat => ({
    name: cat,
    amount: incomeByCategory[cat],
    percentage: totalIncome > 0 ? Math.round((incomeByCategory[cat] / totalIncome) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)

  // 4. Custom colors for categories
  const categoryColors = {
    'Salaire': 'var(--success)',
    'Remboursement': '#06b6d4',
    'Abonnement': '#8b5cf6',
    'Restaurant': 'var(--accent)',
    'Divers': 'var(--text-secondary)'
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Analytiques Financières</h2>
      </div>

      <div className="analytics-summary-grid">
        <div className="analytics-summary-card">
          <div className="analytics-card-title">Revenus Totaux</div>
          <div className="analytics-card-value positive">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="analytics-card-desc">{incomesList.length} transactions complétées</div>
        </div>

        <div className="analytics-summary-card">
          <div className="analytics-card-title">Dépenses Totales</div>
          <div className="analytics-card-value negative">${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="analytics-card-desc">{expensesList.length} transactions complétées</div>
        </div>

        <div className="analytics-summary-card savings-card">
          <div className="analytics-card-title">Épargne Réalisée</div>
          <div className="analytics-card-value" style={{ color: 'var(--success)' }}>
            ${savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="savings-progress-wrapper">
            <div className="savings-progress-label">
              <span>Taux d'Épargne</span>
              <span>{savingsRate}%</span>
            </div>
            <div className="savings-progress-bar">
              <div className="savings-progress-fill" style={{ width: `${savingsRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-details-grid">
        {/* Expenses by Category */}
        <div className="analytics-detail-card">
          <div className="detail-card-header">
            <h3>Dépenses par Catégorie</h3>
          </div>
          <div className="detail-card-body">
            {expenseCategories.length === 0 ? (
              <div className="empty-message">Aucune dépense enregistrée</div>
            ) : (
              expenseCategories.map(cat => (
                <div key={cat.name} className="analytics-progress-item">
                  <div className="progress-item-header">
                    <span className="progress-item-name">{cat.name}</span>
                    <span className="progress-item-value">
                      ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: categoryColors[cat.name] || 'var(--accent)'
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Income by Category */}
        <div className="analytics-detail-card">
          <div className="detail-card-header">
            <h3>Revenus par Catégorie</h3>
          </div>
          <div className="detail-card-body">
            {incomeCategories.length === 0 ? (
              <div className="empty-message">Aucun revenu enregistré</div>
            ) : (
              incomeCategories.map(cat => (
                <div key={cat.name} className="analytics-progress-item">
                  <div className="progress-item-header">
                    <span className="progress-item-name">{cat.name}</span>
                    <span className="progress-item-value">
                      ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: categoryColors[cat.name] || 'var(--success)'
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
