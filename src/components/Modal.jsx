import { useState, useEffect } from 'react'
import './Modal.css'

export default function Modal({ modal, onClose, wallets, beneficiaries, onSubmit }) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const defaults = {
      transaction: { type: modal.defaultType || 'income', wallet_id: wallets[0]?.id || '', category: '', description: '', amount: '', currency: 'USD', status: 'completed', recipient: '' },
      wallet: { name: '', currency: 'USD', balance: '0' },
      beneficiary: { name: '', email: '', account_number: '', bank: '' },
      goal: { name: '', emoji: '🎯', target_amount: '', color: 'orange' },
      card: { name: '', last_four: '', type: 'visa', balance: '0' },
      invoice: { number: '', client: '', amount: '', due_date: '', status: 'pending' },
    }
    setFormData(defaults[modal.type] || {})
  }, [modal.type, modal.defaultType, wallets])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!onSubmit) {
      alert('Erreur: aucune fonction de soumission')
      return
    }

    setLoading(true)
    
    try {
      const data = { ...formData }
      
      if (modal.type === 'transaction') {
        data.amount = parseFloat(data.amount)
        data.wallet_id = parseInt(data.wallet_id)
      } else if (modal.type === 'wallet') {
        data.balance = parseFloat(data.balance) || 0
      } else if (modal.type === 'goal') {
        data.target_amount = parseFloat(data.target_amount) || 0
        data.current_amount = 0
      } else if (modal.type === 'card') {
        data.balance = parseFloat(data.balance) || 0
      } else if (modal.type === 'invoice') {
        data.amount = parseFloat(data.amount)
      }

      console.log('Submitting data:', data)
      await onSubmit(data)
      onClose()
    } catch (err) {
      console.error('Submit error:', err)
      alert('Erreur lors de l\'enregistrement: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    outline: 'none',
    background: 'var(--bg-primary)',
    marginBottom: '12px',
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
    display: 'block',
  }

  const titles = {
    transaction: 'Nouvelle Transaction',
    wallet: 'Nouveau Portefeuille',
    beneficiary: 'Nouveau Bénéficiaire',
    goal: 'Nouvel Objectif',
    card: 'Nouvelle Carte',
    invoice: 'Nouvelle Facture',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titles[modal.type]}</h2>
          <button type="button" className="modal-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          {modal.type === 'transaction' && (
            <>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={formData.type || ''} onChange={e => updateField('type', e.target.value)}>
                <option value="income">Revenu</option>
                <option value="expense">Dépense</option>
                <option value="transfer">Transfert</option>
              </select>
              <label style={labelStyle}>Portefeuille</label>
              <select style={inputStyle} value={formData.wallet_id || ''} onChange={e => updateField('wallet_id', e.target.value)}>
                <option value="">Sélectionner</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>)}
              </select>
              <label style={labelStyle}>Catégorie</label>
              <input style={inputStyle} placeholder="Ex: Salaire, Restaurant..." value={formData.category || ''} onChange={e => updateField('category', e.target.value)} required />
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} placeholder="Description..." value={formData.description || ''} onChange={e => updateField('description', e.target.value)} />
              <label style={labelStyle}>Montant</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="0.00" value={formData.amount || ''} onChange={e => updateField('amount', e.target.value)} required />
              <label style={labelStyle}>Devise</label>
              <select style={inputStyle} value={formData.currency || 'USD'} onChange={e => updateField('currency', e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="XAF">XAF (FCFA BEAC)</option>
                <option value="XOF">XOF (FCFA BCEAO)</option>
                <option value="CDF">CDF (Franc Congolais)</option>
                <option value="NGN">NGN (Naira)</option>
                <option value="ZAR">ZAR (Rand)</option>
              </select>
              <label style={labelStyle}>Statut</label>
              <select style={inputStyle} value={formData.status || 'completed'} onChange={e => updateField('status', e.target.value)}>
                <option value="completed">Complété</option>
                <option value="pending">En cours</option>
                <option value="failed">Échoué</option>
              </select>
              {formData.type === 'transfer' && (
                <>
                  <label style={labelStyle}>Bénéficiaire</label>
                  <select style={inputStyle} value={formData.recipient || ''} onChange={e => updateField('recipient', e.target.value)}>
                    <option value="">Sélectionner</option>
                    {beneficiaries.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </>
              )}
            </>
          )}

          {modal.type === 'wallet' && (
            <>
              <label style={labelStyle}>Nom</label>
              <input style={inputStyle} placeholder="Ex: Compte Principal" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required />
              <label style={labelStyle}>Devise</label>
              <select style={inputStyle} value={formData.currency || 'USD'} onChange={e => updateField('currency', e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="XAF">XAF (FCFA BEAC)</option>
                <option value="XOF">XOF (FCFA BCEAO)</option>
                <option value="CDF">CDF (Franc Congolais)</option>
                <option value="NGN">NGN (Naira)</option>
                <option value="ZAR">ZAR (Rand)</option>
              </select>
              <label style={labelStyle}>Balance initiale</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="0.00" value={formData.balance || ''} onChange={e => updateField('balance', e.target.value)} />
            </>
          )}

          {modal.type === 'beneficiary' && (
            <>
              <label style={labelStyle}>Nom</label>
              <input style={inputStyle} placeholder="Nom complet" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required />
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" placeholder="email@exemple.com" value={formData.email || ''} onChange={e => updateField('email', e.target.value)} />
              <label style={labelStyle}>Numéro de compte</label>
              <input style={inputStyle} placeholder="FR76..." value={formData.account_number || ''} onChange={e => updateField('account_number', e.target.value)} />
              <label style={labelStyle}>Banque</label>
              <input style={inputStyle} placeholder="Nom de la banque" value={formData.bank || ''} onChange={e => updateField('bank', e.target.value)} />
            </>
          )}

          {modal.type === 'goal' && (
            <>
              <label style={labelStyle}>Nom</label>
              <input style={inputStyle} placeholder="Ex: Acompte maison" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required />
              <label style={labelStyle}>Emoji</label>
              <input style={inputStyle} placeholder="🎯" value={formData.emoji || '🎯'} onChange={e => updateField('emoji', e.target.value)} />
              <label style={labelStyle}>Montant cible</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="10000" value={formData.target_amount || ''} onChange={e => updateField('target_amount', e.target.value)} required />
              <label style={labelStyle}>Couleur</label>
              <select style={inputStyle} value={formData.color || 'orange'} onChange={e => updateField('color', e.target.value)}>
                <option value="orange">Orange</option>
                <option value="green">Vert</option>
                <option value="blue">Bleu</option>
              </select>
            </>
          )}

          {modal.type === 'card' && (
            <>
              <label style={labelStyle}>Nom</label>
              <input style={inputStyle} placeholder="Ex: Carte Principale" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required />
              <label style={labelStyle}>4 derniers chiffres</label>
              <input style={inputStyle} placeholder="4242" maxLength="4" value={formData.last_four || ''} onChange={e => updateField('last_four', e.target.value)} required />
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={formData.type || 'visa'} onChange={e => updateField('type', e.target.value)}>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
              <label style={labelStyle}>Balance</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="0.00" value={formData.balance || ''} onChange={e => updateField('balance', e.target.value)} />
            </>
          )}

          {modal.type === 'invoice' && (
            <>
              <label style={labelStyle}>Numéro</label>
              <input style={inputStyle} placeholder="INV-2024-001" value={formData.number || ''} onChange={e => updateField('number', e.target.value)} required />
              <label style={labelStyle}>Client</label>
              <input style={inputStyle} placeholder="Nom du client" value={formData.client || ''} onChange={e => updateField('client', e.target.value)} required />
              <label style={labelStyle}>Montant</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="0.00" value={formData.amount || ''} onChange={e => updateField('amount', e.target.value)} required />
              <label style={labelStyle}>Date d'échéance</label>
              <input style={inputStyle} type="date" value={formData.due_date || ''} onChange={e => updateField('due_date', e.target.value)} />
              <label style={labelStyle}>Statut</label>
              <select style={inputStyle} value={formData.status || 'pending'} onChange={e => updateField('status', e.target.value)}>
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
                <option value="overdue">En retard</option>
              </select>
            </>
          )}

          <button type="submit" className="modal-submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}
