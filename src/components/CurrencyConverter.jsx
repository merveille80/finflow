import { useState, useEffect } from 'react'
import './CurrencyConverter.css'

// Pre-configured static fallback rates (used when offline)
const fallbackRates = {
  USD_EUR: 0.92,
  EUR_USD: 1.09,
  USD_GBP: 0.79,
  GBP_USD: 1.27,
  USD_JPY: 154.50,
  JPY_USD: 0.0065,
  EUR_GBP: 0.86,
  GBP_EUR: 1.16,
  EUR_JPY: 168.00,
  JPY_EUR: 0.0060,
  GBP_JPY: 195.00,
  JPY_GBP: 0.0051,
  // African Currencies Fallbacks (vs USD)
  USD_XAF: 605.00,
  XAF_USD: 0.0016,
  USD_XOF: 605.00,
  XOF_USD: 0.0016,
  USD_CDF: 2800.00,
  CDF_USD: 0.00035,
  USD_NGN: 1400.00,
  NGN_USD: 0.00071,
  USD_ZAR: 19.00,
  ZAR_USD: 0.052,
}

export default function CurrencyConverter({ wallets = [], onAddTransaction }) {
  const [fromAmount, setFromAmount] = useState(100)
  const [sourceWalletId, setSourceWalletId] = useState('')
  const [targetWalletId, setTargetWalletId] = useState('')
  
  // Exchange rates state
  const [liveRate, setLiveRate] = useState(null)
  const [isLive, setIsLive] = useState(false)

  // Initialize wallets when loaded
  useEffect(() => {
    if (wallets.length >= 2) {
      setSourceWalletId(wallets[0].id.toString())
      setTargetWalletId(wallets[1].id.toString())
    }
  }, [wallets])

  const sourceWallet = wallets.find(w => w.id.toString() === sourceWalletId) || wallets[0]
  const targetWallet = wallets.find(w => w.id.toString() === targetWalletId) || wallets[1]

  const fromCurrency = sourceWallet ? sourceWallet.currency : 'USD'
  const toCurrency = targetWallet ? targetWallet.currency : 'EUR'

  // Fetch live exchange rates from keyless public api
  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setLiveRate(1)
      setIsLive(true)
      return
    }

    const fetchLiveRate = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
        if (!res.ok) throw new Error("API rate fetch failed")
        const data = await res.json()
        if (data.rates && data.rates[toCurrency]) {
          setLiveRate(data.rates[toCurrency])
          setIsLive(true)
        } else {
          throw new Error("Target currency rate unavailable")
        }
      } catch (err) {
        console.warn("CurrencyConverter fallback to local static rates:", err)
        setLiveRate(null) // Triggers local static fallback
        setIsLive(false)
      }
    }

    fetchLiveRate()
  }, [fromCurrency, toCurrency])

  // Get active rate (live or fallback)
  const getRate = () => {
    if (liveRate !== null) return liveRate
    if (fromCurrency === toCurrency) return 1
    const rateKey = `${fromCurrency}_${toCurrency}`
    return fallbackRates[rateKey] || 
           (fallbackRates[`${toCurrency}_${fromCurrency}`] ? 1 / fallbackRates[`${toCurrency}_${fromCurrency}`] : 1)
  }

  const activeRate = getRate()
  const result = (fromAmount * activeRate).toFixed(2)

  const handleSwap = () => {
    const temp = sourceWalletId
    setSourceWalletId(targetWalletId)
    setTargetWalletId(temp)
    setFromAmount(parseFloat(result))
  }

  const handleConvert = async () => {
    if (!sourceWallet || !targetWallet) {
      alert('Veuillez sélectionner deux portefeuilles valides.')
      return
    }

    if (fromAmount <= 0) {
      alert('Veuillez entrer un montant supérieur à 0.')
      return
    }

    if (sourceWallet.balance < fromAmount) {
      alert(`Solde insuffisant dans ${sourceWallet.name} ! Solde actuel : ${sourceWallet.balance.toFixed(2)} ${fromCurrency}`)
      return
    }

    if (sourceWallet.id === targetWallet.id) {
      alert('Veuillez sélectionner deux portefeuilles différents pour effectuer un échange.')
      return
    }

    try {
      // 1. Create expense in source wallet
      await onAddTransaction({
        wallet_id: sourceWallet.id,
        type: 'expense',
        category: 'Échange',
        description: `Échange (${fromCurrency} → ${toCurrency}) vers ${targetWallet.name}`,
        amount: fromAmount,
        currency: sourceWallet.currency,
        status: 'completed'
      })

      // 2. Create income in target wallet
      await onAddTransaction({
        wallet_id: targetWallet.id,
        type: 'income',
        category: 'Échange',
        description: `Échange (${fromCurrency} → ${toCurrency}) depuis ${sourceWallet.name}`,
        amount: parseFloat(result),
        currency: targetWallet.currency,
        status: 'completed'
      })

      alert(`Échange effectué avec succès !\n\n-${fromAmount} ${fromCurrency} de "${sourceWallet.name}"\n+${result} ${toCurrency} vers "${targetWallet.name}"`)
    } catch (e) {
      console.error(e)
      alert("Une erreur est survenue lors de l'échange.")
    }
  }

  return (
    <div className="convert-card glass-card">
      <div className="card-header">
        <h3 className="card-title" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Convertir & Échanger</h3>
      </div>

      <div className="convert-input-group">
        <div className="convert-label" style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>De (Débit)</div>
        <div className="convert-input-wrapper">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(parseFloat(e.target.value) || 0)}
            style={{ color: 'var(--text-primary)' }}
          />
          <select
            className="convert-currency-select"
            value={sourceWalletId}
            onChange={(e) => setSourceWalletId(e.target.value)}
            style={{ color: 'var(--text-primary)', background: 'var(--bg-primary)' }}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>
                {w.currency === 'USD' ? '🇺🇸' : w.currency === 'EUR' ? '🇪🇺' : w.currency === 'GBP' ? '🇬🇧' : '🇯🇵'} {w.name} ({w.currency})
              </option>
            ))}
          </select>
        </div>
        {sourceWallet && (
          <div className="convert-wallet-balance" style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '4px', fontWeight: '600' }}>
            Solde disponible : {sourceWallet.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {sourceWallet.currency}
          </div>
        )}
      </div>

      <div className="convert-swap">
        <button className="swap-btn" onClick={handleSwap} style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        </button>
      </div>

      <div className="convert-input-group">
        <div className="convert-label" style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Vers (Crédit)</div>
        <div className="convert-input-wrapper">
          <input type="number" value={result} readOnly style={{ color: 'var(--text-primary)' }} />
          <select
            className="convert-currency-select"
            value={targetWalletId}
            onChange={(e) => setTargetWalletId(e.target.value)}
            style={{ color: 'var(--text-primary)', background: 'var(--bg-primary)' }}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>
                {w.currency === 'USD' ? '🇺🇸' : w.currency === 'EUR' ? '🇪🇺' : w.currency === 'GBP' ? '🇬🇧' : '🇯🇵'} {w.name} ({w.currency})
              </option>
            ))}
          </select>
        </div>
        {targetWallet && (
          <div className="convert-wallet-balance" style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '4px', fontWeight: '600' }}>
            Solde actuel : {targetWallet.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {targetWallet.currency}
          </div>
        )}
      </div>

      <div className="convert-result" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px' }}>
        <div>
          <div className="convert-result-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Taux de change appliqué</div>
          <div className="convert-result-value" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
            1 {fromCurrency} = {activeRate.toFixed(4)} {toCurrency}
          </div>
        </div>
        
        {/* Dynamic Live Connection Badge */}
        <div style={{
          fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
          background: isLive ? 'rgba(52,211,153,0.06)' : 'rgba(245,158,11,0.06)',
          border: `1px solid ${isLive ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)'}`,
          color: isLive ? '#34d399' : '#fbbf24',
          padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLive ? '#10b981' : '#f59e0b', boxShadow: `0 0 6px ${isLive ? '#10b981' : '#f59e0b'}` }}></span>
          {isLive ? 'Temps Réel' : 'Statique'}
        </div>
      </div>

      <button className="convert-btn" onClick={handleConvert}>
        Confirmer l'Échange
      </button>
    </div>
  )
}
