import { useState } from 'react'

export default function HistoryPage({ transactions, wallets }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Find wallet name helper
  const getWalletName = (walletId) => {
    const w = wallets.find(x => x.id === walletId)
    return w ? `${w.name} (${w.currency})` : `Portefeuille #${walletId}`
  }

  // Filter transactions
  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase()) ||
                          t.category?.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  // Group by date helper
  const groupTransactionsByDate = (txsList) => {
    const groups = {}
    txsList.forEach(t => {
      const date = new Date(t.created_at || Date.now())
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      let dateString = ''
      if (date.toDateString() === today.toDateString()) {
        dateString = "Aujourd'hui"
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateString = "Hier"
      } else {
        // Month Year format in French
        const options = { month: 'long', year: 'numeric' }
        dateString = date.toLocaleDateString('fr-FR', options)
        // Capitalize first letter
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1)
      }

      if (!groups[dateString]) {
        groups[dateString] = []
      }
      groups[dateString].push(t)
    })
    return groups
  }

  const groupedTxs = groupTransactionsByDate(filteredTxs)
  const uniqueCategories = [...new Set(transactions.map(t => t.category))]

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <span className="page-subtitle">Piste d'audit financière</span>
          <h1 className="page-title">Fil d'Historique</h1>
        </div>
      </div>

      {/* Advanced Filters Grid */}
      <div className="card glass-card" style={{ marginTop: '24px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          {/* Search bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Rechercher</label>
            <input
              type="text"
              placeholder="Description, catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px',
                outline: 'none', transition: 'all 0.2s'
              }}
            />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Type de flux</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px',
                outline: 'none', transition: 'all 0.2s'
              }}
            >
              <option value="all" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>Tous les flux</option>
              <option value="income" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>Entrées (Revenus)</option>
              <option value="expense" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>Sorties (Dépenses)</option>
              <option value="transfer" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>Virements internes</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Catégorie</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px',
                outline: 'none', transition: 'all 0.2s'
              }}
            >
              <option value="all" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>Toutes les catégories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Vertical Timeline Thread */}
      {filteredTxs.length === 0 ? (
        <div className="card glass-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style={{ fontSize: '15px', fontWeight: '600' }}>Aucune transaction trouvée pour ces filtres.</p>
        </div>
      ) : (
        <div className="timeline-thread" style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingLeft: '10px', position: 'relative' }}>
          
          {Object.keys(groupedTxs).map(dateGroup => (
            <div key={dateGroup} className="timeline-date-group">
              {/* Date Header Badge */}
              <div className="timeline-date-badge" style={{
                color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '20px',
                boxShadow: 'var(--shadow)'
              }}>
                {dateGroup}
              </div>

              {/* Transactions list inside this date group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px dashed var(--border)', marginLeft: '12px', paddingLeft: '24px', position: 'relative' }}>
                
                {groupedTxs[dateGroup].map(t => {
                  const isIncome = t.type === 'income'
                  const isTransfer = t.type === 'transfer'
                  let dotColor = '#f87171' // Red for expense
                  let flowSymbol = '-'
                  if (isIncome) {
                    dotColor = '#34d399' // Green for income
                    flowSymbol = '+'
                  } else if (isTransfer) {
                    dotColor = '#60a5fa' // Blue for transfer
                    flowSymbol = '⇄'
                  }

                  return (
                    <div key={t.id} className="timeline-node animate-fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      {/* Timeline dot */}
                      <div className="timeline-dot" style={{
                        position: 'absolute', left: '-31px', width: '12px', height: '12px', borderRadius: '50%',
                        background: dotColor, boxShadow: `0 0 10px ${dotColor}`, border: '3px solid var(--bg-primary)'
                      }}></div>

                      {/* Content Card */}
                      <div className="card glass-card timeline-card" style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px',
                        transition: 'transform 0.2s', cursor: 'default'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {/* Left icon wrapper */}
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isIncome ? 'rgba(52, 211, 153, 0.06)' : isTransfer ? 'rgba(96, 165, 250, 0.06)' : 'rgba(248, 113, 113, 0.06)',
                            border: `1px solid ${isIncome ? 'rgba(52, 211, 153, 0.15)' : isTransfer ? 'rgba(96, 165, 250, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
                            color: dotColor
                          }}>
                            {isIncome ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                              </svg>
                            ) : isTransfer ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M17 1l4 4-4 4"></path>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <path d="M7 23l-4-4 4-4"></path>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                              </svg>
                            )}
                          </div>

                          {/* Text description */}
                          <div>
                            <h4 style={{ color: 'var(--text-primary)', fontSize: '14.5px', fontWeight: '700' }}>{t.description || t.category}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', border: '1px solid var(--border)' }}>
                                {t.category}
                              </span>
                              <span style={{ fontSize: '11.5px', color: 'var(--text-light)' }}>
                                depuis {getWalletName(t.wallet_id)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Amount block */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '16px', fontWeight: '800', color: isIncome ? '#34d399' : isTransfer ? '#60a5fa' : '#f87171'
                          }}>
                            {flowSymbol} {Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {t.currency}
                          </span>
                          <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>
                            {new Date(t.created_at || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                    </div>
                  )
                })}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}
