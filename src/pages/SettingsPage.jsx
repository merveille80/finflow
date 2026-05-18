import { useState } from 'react'

const API = 'http://127.0.0.1:3001/api'

export default function SettingsPage({ user, onProfileUpdate, onLogout }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPwd, setLoadingPwd] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setLoadingProfile(true)

    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, name, email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Update local cached session
      const updatedUser = { ...user, name: data.name, email: data.email }
      localStorage.setItem('finflow_user', JSON.stringify(updatedUser))
      
      // Notify App.jsx state
      onProfileUpdate(updatedUser)
      setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès !' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPwdMsg({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' })
    }

    setLoadingPwd(true)

    try {
      const res = await fetch(`${API}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, oldPassword, newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setPwdMsg({ type: 'success', text: 'Mot de passe modifié avec succès !' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message })
    } finally {
      setLoadingPwd(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous ABSOLUMENT sûr de vouloir supprimer votre compte FinFlow ? Cette action est irréversible et effacera TOUS vos portefeuilles, transactions, cartes, budgets et bénéficiaires définitivement."
    )
    if (!confirmDelete) return

    try {
      const res = await fetch(`${API}/auth/account?user_id=${user.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert("Votre compte a été supprimé avec succès. Au revoir !")
        onLogout()
      } else {
        const data = await res.json()
        alert(data.error || "Une erreur est survenue.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur réseau de suppression.")
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <span className="page-subtitle">Ajustements généraux</span>
          <h1 className="page-title">Paramètres du Compte</h1>
        </div>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '24px' }}>
        
        {/* Profile Settings Card */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>Mon Profil</h3>
            <p className="card-desc">Modifiez vos informations personnelles d'identification.</p>
          </div>
          
          {profileMsg.text && (
            <div className={`toast-message ${profileMsg.type}`} style={{
              background: profileMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${profileMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              color: profileMsg.type === 'success' ? '#34d399' : '#f87171',
              padding: '12px', borderRadius: '10px', fontSize: '13.5px', marginBottom: '16px', fontWeight: '600'
            }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Nom complet</label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Adresse E-mail</label>
              <input
                type="email"
                placeholder="votre.email@compte.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s'
                }}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loadingProfile} style={{ marginTop: '8px' }}>
              {loadingProfile ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        {/* Password Reset Card */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>Sécurité</h3>
            <p className="card-desc">Renforcez ou changez votre clé d'accès FinFlow.</p>
          </div>

          {pwdMsg.text && (
            <div className={`toast-message ${pwdMsg.type}`} style={{
              background: pwdMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${pwdMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              color: pwdMsg.type === 'success' ? '#34d399' : '#f87171',
              padding: '12px', borderRadius: '10px', fontSize: '13.5px', marginBottom: '16px', fontWeight: '600'
            }}>
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Ancien mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s'
                }}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loadingPwd} style={{ marginTop: '8px' }}>
              {loadingPwd ? 'Modification...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>

      </div>

      {/* Danger Zone */}
      <div className="card glass-card danger-zone" style={{
        marginTop: '30px', border: '1px solid rgba(239, 68, 68, 0.15)', background: 'rgba(239, 68, 68, 0.02)',
        boxShadow: '0 8px 30px rgba(239, 68, 68, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '18px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Zone de Danger
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '600px' }}>
              La suppression de votre compte effacera de façon irréversible l'intégralité de vos portefeuilles, cartes, transactions et budgets. Cette action ne peut pas être annulée.
            </p>
          </div>
          <button 
            type="button"
            className="btn" 
            onClick={handleDeleteAccount}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
          >
            Supprimer mon compte définitivement
          </button>
        </div>
      </div>
    </div>
  )
}
