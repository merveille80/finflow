import { useState, useEffect } from 'react'
import './TontinesPage.css'

export default function TontinesPage({ user }) {
  const [tontines, setTontines] = useState([])
  const [selectedTontine, setSelectedTontine] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [showNewTontineModal, setShowNewTontineModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchTontines()
  }, [])

  const fetchTontines = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/tontines?user_id=${user.id}`)
      const data = await res.json()
      setTontines(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async (tontineId) => {
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/tontines/${tontineId}/members`)
      const data = await res.json()
      setMembers(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectTontine = (t) => {
    setSelectedTontine(t)
    fetchMembers(t.id)
  }

  const handleCreateTontine = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://127.0.0.1:3001/api/tontines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: user.id })
      })
      if (res.ok) {
        setShowNewTontineModal(false)
        setFormData({})
        fetchTontines()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/tontines/${selectedTontine.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, payout_turn: members.length + 1 })
      })
      if (res.ok) {
        setShowAddMemberModal(false)
        setFormData({})
        fetchMembers(selectedTontine.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Chargement de vos tontines...</div>

  // Detail View
  if (selectedTontine) {
    const totalPot = selectedTontine.cycle_amount * members.length
    
    return (
      <div className="tontine-page tontine-detail-view animate-fade-in">
        <button className="back-btn" onClick={() => setSelectedTontine(null)}>
          ← Retour aux Tontines
        </button>

        <div className="tontine-pot-banner">
          <div className="pot-label">{selectedTontine.name} • Cagnotte du Tour</div>
          <div className="pot-amount">{totalPot.toLocaleString()} {selectedTontine.currency}</div>
          <div className="pot-sub">Cotisation: {selectedTontine.cycle_amount} {selectedTontine.currency} / {selectedTontine.frequency}</div>
        </div>

        <div className="members-section">
          <div className="members-header">
            <h3>Membres & Ordre de Passage</h3>
            <button className="btn-new-tontine" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => setShowAddMemberModal(true)}>
              + Ajouter Membre
            </button>
          </div>
          
          <div className="members-list">
            {members.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Aucun membre dans cette tontine.</p>
            ) : (
              members.map(m => (
                <div className="member-item glass-card" key={m.id}>
                  <div className="member-info">
                    <div className="member-turn">{m.payout_turn}</div>
                    <div>
                      <div className="member-name">{m.name}</div>
                      <div className="member-phone">{m.phone || 'Pas de numéro'}</div>
                    </div>
                  </div>
                  <button className="btn-pay" onClick={() => alert('Fonction de paiement au tour bientôt disponible!')}>
                    Marquer Payé
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Member Modal (Simplified inline for now) */}
        {showAddMemberModal && (
          <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nouveau Membre</h2>
                <button className="modal-close" onClick={() => setShowAddMemberModal(false)}></button>
              </div>
              <form onSubmit={handleAddMember}>
                <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Nom complet</label>
                <input 
                  style={{ width:'100%', padding:'10px', marginBottom:'12px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                  required
                  placeholder="Ex: Koffi Emmanuel"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Téléphone</label>
                <input 
                  style={{ width:'100%', padding:'10px', marginBottom:'20px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                  placeholder="+225..."
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                <button type="submit" className="btn-new-tontine" style={{ width: '100%' }}>Ajouter au Cercle</button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // List View
  return (
    <div className="tontine-page animate-fade-in">
      <div className="tontine-header">
        <div>
          <h2>Cercles de Tontine</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Gérez vos épargnes de groupe traditionnelles.</p>
        </div>
        <button className="btn-new-tontine" onClick={() => setShowNewTontineModal(true)}>
          + Créer une Tontine
        </button>
      </div>

      <div className="tontine-grid">
        {tontines.length === 0 ? (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Vous ne gérez aucune tontine pour le moment.</p>
          </div>
        ) : (
          tontines.map(t => (
            <div className="tontine-card glass-card" key={t.id} onClick={() => handleSelectTontine(t)}>
              <div className="tontine-card-header">
                <h3>{t.name}</h3>
                <span className="tontine-badge">{t.status}</span>
              </div>
              <div className="tontine-stats">
                <div className="tontine-stat-item">
                  <span className="tontine-stat-label">Cotisation ({t.frequency})</span>
                  <span className="tontine-stat-value">{t.cycle_amount} {t.currency}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Tontine Modal */}
      {showNewTontineModal && (
        <div className="modal-overlay" onClick={() => setShowNewTontineModal(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Créer un Cercle</h2>
              <button className="modal-close" onClick={() => setShowNewTontineModal(false)}></button>
            </div>
            <form onSubmit={handleCreateTontine}>
              <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Nom du Cercle</label>
              <input 
                style={{ width:'100%', padding:'10px', marginBottom:'12px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                required
                placeholder="Ex: Tontine Famille"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Montant Cotisation</label>
                  <input 
                    type="number"
                    style={{ width:'100%', padding:'10px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                    required
                    placeholder="50000"
                    onChange={e => setFormData({...formData, cycle_amount: parseFloat(e.target.value)})}
                  />
                </div>
                <div style={{ width: '100px' }}>
                  <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Devise</label>
                  <select 
                    style={{ width:'100%', padding:'10px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                    defaultValue="XAF"
                  >
                    <option value="XAF">XAF</option>
                    <option value="XOF">XOF</option>
                    <option value="CDF">CDF</option>
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <label style={{ display:'block', marginBottom:'4px', fontSize:'13px', color:'var(--text-secondary)' }}>Fréquence</label>
              <select 
                style={{ width:'100%', padding:'10px', marginBottom:'20px', background:'var(--bg-primary)', border:'1px solid var(--border)', color:'var(--text-primary)', borderRadius:'8px' }}
                onChange={e => setFormData({...formData, frequency: e.target.value})}
                defaultValue="mensuelle"
              >
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="mensuelle">Mensuelle</option>
              </select>

              <button type="submit" className="btn-new-tontine" style={{ width: '100%' }}>Créer la Tontine</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
