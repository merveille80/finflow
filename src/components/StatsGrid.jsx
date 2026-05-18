import './StatsGrid.css'

export default function StatsGrid({ stats, wallets }) {
  const incomeBars = [40, 60, 35, 80, 55, 70, 90, 65, 100]
  const expenseBars = [70, 50, 85, 40, 60, 45, 55, 35, 50]
  const currencyMap = { USD: { symbol: '$', class: 'usd' }, EUR: { symbol: '€', class: 'eur' }, GBP: { symbol: '£', class: 'gbp' }, JPY: { symbol: '¥', class: 'jpy' } }

  return (
    <div className="stats-grid">
      <div className="stat-card main-balance">
        <div className="stat-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
          Balance Totale
        </div>
        <div className="stat-value">${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="stat-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          {wallets.length} portefeuilles
        </div>
        <div className="currency-breakdown">
          {wallets.map(w => {
            const c = currencyMap[w.currency] || { symbol: w.currency, class: 'usd' }
            return (
              <div key={w.id} className="currency-item">
                <div className={`currency-icon ${c.class}`}>{c.symbol}</div>
                <div>
                  <div className="currency-name">{w.currency}</div>
                  <div className="currency-amount">{c.symbol}{w.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Revenus</div>
        <div className="stat-value small">${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="stat-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          Total
        </div>
        <div className="sparkline">
          {incomeBars.map((h, i) => <div key={i} className="sparkline-bar" style={{ height: h + '%' }}></div>)}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Dépenses</div>
        <div className="stat-value small">${stats.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="stat-change negative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          Total
        </div>
        <div className="sparkline">
          {expenseBars.map((h, i) => <div key={i} className="sparkline-bar expense" style={{ height: h + '%' }}></div>)}
        </div>
      </div>
    </div>
  )
}
