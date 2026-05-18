import { useState, useEffect } from 'react'
import './TontinesPage.css'

const API = 'http://127.0.0.1:3001/api'

export default function TontinesPage({ user }) {
  const [tontines, setTontines] = useState([])
  const [selectedTontine, setSelectedTontine] = useState(null)
  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState(null)

  // Modals state
  const [showNewTontineModal, setShowNewTontineModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchTontines()
  }, [])

  const fetchTontines = async () => {
    try {
      const res = await fetch(`${API}/tontines?user_id=${user.id}`)
      const data = await res.json()
      setTontines(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setTontines([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async (tontineId) => {
    try {
      const [membersRes, paymentsRes] = await Promise.all([
        fetch(`${API}/tontines/${tontineId}/members`).then(r => r.json()),
        fetch(`${API}/tontines/${tontineId}/payments`).then(r => r.json()),
      ])
      setMembers(Array.isArray(membersRes) ? membersRes : [])
      setPayments(Array.isArray(paymentsRes) ? paymentsRes : [])
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
      const res = await fetch(`${API}/tontines`, {
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
      const res = await fetch(`${API}/tontines/${selectedTontine.id}/members`, {
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

  // Enregistre le paiement d'un membre pour le tour actuel
  const handlePayMember = async (memberId) => {
    const currentRound = Math.floor(payments.length / members.length) + 1
    setPayingId(memberId)
    try {
      const res = await fetch(`${API}/tontines/${selectedTontine.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: memberId,
          amount: selectedTontine.cycle_amount,
          round_number: currentRound
        })
      })
      if (res.ok) {
        await fetchMembers(selectedTontine.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPayingId(null)
    }
  }

  // Vérifie si un membre a déjà payé pour le tour actuel
  const hasPaidThisRound = (memberId) => {
    if (members.length === 0) return false
    const currentRound = Math.floor(payments.length / members.length) + 1
    return payments.some(p => p.member_id === memberId && p.round_number === currentRound)
  }

  // Trouve le membre qui doit "bouffer" (recevoir) la cagnotte ce tour
  const getCurrentRecipient = () => {
    if (members.length === 0) return null
    const roundIndex = Math.floor(payments.filter((p, i, arr) =>
      arr.findIndex(x => x.member_id === p.member_id && x.round_number === p.round_number) === i
    ).length / members.length)
    const recipientTurn = (roundIndex % members.length) + 1
    return members.find(m => m.payout_turn === recipientTurn)
  }

  if (loading) return <div>Chargement de vos tontines...</div>

  // Detail View
  if (selectedTontine) {
    const totalPot = selectedTontine.cycle_amount * members.length
    const currentRound = members.length > 0 ? Math.floor(payments.length / members.length) + 1 : 1
    const recipient = getCurrentRecipient()
    const paidCount = members.filter(m => hasPaidThisRound(m.id)).length

    return (
      <div className="tontine-page tontine-detail-view animate-fade-in">
        <button className="back-btn" onClick={() => setSelectedTontine(null)}>
          ← Retour aux Tontines
        </button>

        {/* Main Pot Banner */}
        <div className="tontine-pot-banner">
          <div className="pot-label">{selectedTontine.name} • Tour N°{currentRound}</div>
          <div className="pot-amount">{totalPot.toLocaleString('fr-FR')} {selectedTontine.currency}</div>
          <div className="pot-sub">
            Cotisation: {selectedTontine.cycle_amount.toLocaleString('fr-FR')} {selectedTontine.currency} / {selectedTontine.frequency}
            &nbsp;•&nbsp; {paidCount}/{members.length} cotisations reçues
          </div>
        </div>

        {/* Current Recipient Banner */}
        {recipient && (
          <div style={{
            background: 'linear-gradient(135deg, #ffb700, #ff8c00)',
            borderRadius: '16px',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(255,183,0,0.25)'
          }}>
            <div style={{ fontSize: '32px' }}>🏆</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Bénéficiaire du Tour {currentRound}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '4px' }}>{recipient.name}</div>
              <div style={{ fontSize: '13px', opacity: 0.85 }}>Encaisse {totalPot.toLocaleString('fr-FR')} {selectedTontine.currency} dès que tous ont cotisé</div>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="members-section">
          <div className="members-header">
            <h3>Membres & Cotisations — Tour {currentRound}</h3>
            <button className="btn-new-tontine" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => setShowAddMemberModal(true)}>
              + Ajouter Membre
            </button>
          </div>

          <div className="members-list">
            {members.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Aucun membre dans cette tontine. Ajoutez des membres pour commencer.</p>
            ) : (
              members.map(m => {
                const paid = hasPaidThisRound(m.id)
                const isRecipient = recipient && recipient.id === m.id
                return (
                  <div className="member-item glass-card" key={m.id} style={{
                    borderLeft: isRecipient ? '3px solid #ffb700' : paid ? '3px solid #10b981' : '3px solid transparent'
                  }}>
                    <div className="member-info">
                      <div className="member-turn" style={{ background: isRecipient ? 'rgba(255,183,0,0.15)' : 'rgba(255,107,0,0.1)', color: isRecipient ? '#ffb700' : 'var(--accent)' }}>
                        {isRecipient ? '🏆' : m.payout_turn}
                      </div>
                      <div>
                        <div className="member-name">{m.name}</div>
                        <div className="member-phone">{m.phone || 'Pas de numéro'}</div>
                      </div>
                    </div>
                    <button
                      className={`btn-pay ${paid ? 'paid' : ''}`}
                      disabled={paid || payingId === m.id}
                      onClick={() => !paid && handlePayMember(m.id)}
                    >
                      {payingId === m.id ? '⏳ En cours...' : paid ? '✅ Payé' : 'Marquer Payé'}
                    </button>
                  </div>
                )
              })
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
