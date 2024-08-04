const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados e rotas
const dbPath = path.join(__dirname, 'financas.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    description TEXT,
    value REAL NOT NULL
  )`);
});

app.post('/transactions', (req, res) => {
  const { type, description, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ error: 'Type and value are required' });
  }

  const stmt = db.prepare('INSERT INTO transactions (type, description, value) VALUES (?, ?, ?)');
  stmt.run(type, description || null, value, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to insert transaction' });
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
