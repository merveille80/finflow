const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// --- PBKDF2 Native Hashing Helper Functions ---
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const parts = storedPassword.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === testHash;
}

// --- Authentication Endpoints ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  try {
    const hashedPassword = hashPassword(password);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email.toLowerCase().trim(), hashedPassword);
    res.json({ id: result.lastInsertRowid, name, email: email.toLowerCase().trim() });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Cet e-mail est déjà utilisé.' });
    }
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail et mot de passe requis.' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(400).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Wallets Endpoints ---
app.get('/api/wallets', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const wallets = db.prepare('SELECT * FROM wallets WHERE user_id = ? ORDER BY id').all(userId);
  res.json(wallets);
});

app.post('/api/wallets', (req, res) => {
  const { user_id, name, currency, balance } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
  const stmt = db.prepare('INSERT INTO wallets (user_id, name, currency, balance) VALUES (?, ?, ?, ?)');
  const result = stmt.run(user_id, name, currency, balance || 0);
  res.json({ id: result.lastInsertRowid, user_id, name, currency, balance: balance || 0 });
});

app.delete('/api/wallets/:id', (req, res) => {
  db.prepare('DELETE FROM wallets WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Transactions Endpoints ---
app.get('/api/transactions', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const transactions = db.prepare(`
    SELECT t.* FROM transactions t 
    JOIN wallets w ON t.wallet_id = w.id 
    WHERE w.user_id = ? 
    ORDER BY t.created_at DESC
  `).all(userId);
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const { wallet_id, type, category, description, amount, currency, status, recipient } = req.body;
  const stmt = db.prepare('INSERT INTO transactions (wallet_id, type, category, description, amount, currency, status, recipient) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(wallet_id, type, category, description, amount, currency, status || 'completed', recipient || null);
  
  if (type === 'income') {
    db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').run(amount, wallet_id);
  } else if (type === 'expense') {
    db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').run(amount, wallet_id);
  }
  
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.delete('/api/transactions/:id', (req, res) => {
  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (tx) {
    if (tx.type === 'income') {
      db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').run(tx.amount, tx.wallet_id);
    } else if (tx.type === 'expense') {
      db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').run(tx.amount, tx.wallet_id);
    }
    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  }
  res.json({ success: true });
});

// --- Beneficiaries Endpoints ---
app.get('/api/beneficiaries', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const beneficiaries = db.prepare('SELECT * FROM beneficiaries WHERE user_id = ? ORDER BY name').all(userId);
  res.json(beneficiaries);
});

app.post('/api/beneficiaries', (req, res) => {
  const { user_id, name, email, account_number, bank } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
  const stmt = db.prepare('INSERT INTO beneficiaries (user_id, name, email, account_number, bank) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(user_id, name, email || '', account_number || '', bank || '');
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.delete('/api/beneficiaries/:id', (req, res) => {
  db.prepare('DELETE FROM beneficiaries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Savings Goals Endpoints ---
app.get('/api/goals', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const goals = db.prepare('SELECT * FROM savings_goals WHERE user_id = ? ORDER BY id').all(userId);
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  const { user_id, name, emoji, current_amount, target_amount, color } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
  const stmt = db.prepare('INSERT INTO savings_goals (user_id, name, emoji, current_amount, target_amount, color) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(user_id, name, emoji || '🎯', current_amount || 0, target_amount, color || 'orange');
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/goals/:id', (req, res) => {
  const { current_amount, target_amount } = req.body;
  db.prepare('UPDATE savings_goals SET current_amount = ?, target_amount = ? WHERE id = ?').run(current_amount, target_amount, req.params.id);
  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ?').get(req.params.id);
  res.json(goal);
});

app.delete('/api/goals/:id', (req, res) => {
  db.prepare('DELETE FROM savings_goals WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Cards Endpoints ---
app.get('/api/cards', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const cards = db.prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY id').all(userId);
  res.json(cards);
});

app.post('/api/cards', (req, res) => {
  const { user_id, name, last_four, type, balance } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
  const stmt = db.prepare('INSERT INTO cards (user_id, name, last_four, type, balance, is_active) VALUES (?, ?, ?, ?, ?, 1)');
  const result = stmt.run(user_id, name, last_four, type, balance || 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.delete('/api/cards/:id', (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Invoices Endpoints ---
app.get('/api/invoices', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const invoices = db.prepare('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
  const { user_id, number, client, amount, status, due_date } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
  const stmt = db.prepare('INSERT INTO invoices (user_id, number, client, amount, status, due_date) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(user_id, number, client, amount, status || 'pending', due_date || '');
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/invoices/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE invoices SET status = ? WHERE id = ?').run(status, req.params.id);
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  res.json(invoice);
});

app.delete('/api/invoices/:id', (req, res) => {
  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Tontines Endpoints ---
app.get('/api/tontines', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  const tontines = db.prepare('SELECT * FROM tontines WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json(tontines);
});

app.post('/api/tontines', (req, res) => {
  const { user_id, name, cycle_amount, currency, frequency } = req.body;
  if (!user_id || !name || !cycle_amount) return res.status(400).json({ error: 'Données invalides.' });
  const stmt = db.prepare('INSERT INTO tontines (user_id, name, cycle_amount, currency, frequency) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(user_id, name, cycle_amount, currency || 'XAF', frequency || 'mensuelle');
  res.json({ id: result.lastInsertRowid, ...req.body, status: 'active' });
});

app.get('/api/tontines/:id/members', (req, res) => {
  const members = db.prepare('SELECT * FROM tontine_members WHERE tontine_id = ? ORDER BY payout_turn ASC').all(req.params.id);
  res.json(members);
});

app.post('/api/tontines/:id/members', (req, res) => {
  const { name, phone, payout_turn } = req.body;
  const stmt = db.prepare('INSERT INTO tontine_members (tontine_id, name, phone, payout_turn) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.params.id, name, phone || '', payout_turn);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.get('/api/tontines/:id/payments', (req, res) => {
  const payments = db.prepare('SELECT * FROM tontine_payments WHERE tontine_id = ? ORDER BY payment_date DESC').all(req.params.id);
  res.json(payments);
});

app.post('/api/tontines/:id/payments', (req, res) => {
  const { member_id, amount, round_number } = req.body;
  const stmt = db.prepare('INSERT INTO tontine_payments (tontine_id, member_id, amount, round_number) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.params.id, member_id, amount, round_number);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

// --- Stats Endpoint ---
app.get('/api/stats', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  
  const totalBalance = db.prepare('SELECT SUM(balance) as total FROM wallets WHERE user_id = ?').get(userId);
  const income = db.prepare("SELECT SUM(t.amount) as total FROM transactions t JOIN wallets w ON t.wallet_id = w.id WHERE w.user_id = ? AND t.type = 'income' AND t.status = 'completed'").get(userId);
  const expense = db.prepare("SELECT SUM(t.amount) as total FROM transactions t JOIN wallets w ON t.wallet_id = w.id WHERE w.user_id = ? AND t.type = 'expense' AND t.status = 'completed'").get(userId);
  const monthlyVolume = db.prepare("SELECT SUM(t.amount) as total FROM transactions t JOIN wallets w ON t.wallet_id = w.id WHERE w.user_id = ? AND strftime('%Y-%m', t.created_at) = strftime('%Y-%m', 'now')").get(userId);
  
  res.json({
    totalBalance: totalBalance.total || 0,
    income: income.total || 0,
    expense: expense.total || 0,
    monthlyVolume: monthlyVolume.total || 0
  });
});

// --- Profile and Account Management Endpoints ---
app.put('/api/auth/profile', (req, res) => {
  const { user_id, name, email } = req.body;
  if (!user_id || !name || !email) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  try {
    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email.toLowerCase().trim(), user_id);
    res.json({ success: true, name, email: email.toLowerCase().trim() });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Cet e-mail est déjà utilisé.' });
    }
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/auth/password', (req, res) => {
  const { user_id, oldPassword, newPassword } = req.body;
  if (!user_id || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  try {
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(user_id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    
    const isValid = verifyPassword(oldPassword, user.password);
    if (!isValid) return res.status(400).json({ error: 'Ancien mot de passe incorrect.' });
    
    const newHashed = hashPassword(newPassword);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHashed, user_id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/auth/account', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id requis.' });
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`API running at http://127.0.0.1:${PORT}`);
});
