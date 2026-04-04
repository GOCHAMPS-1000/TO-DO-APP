const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db', // service name in Kubernetes/Docker Compose
  database: 'todos',
  password: 'password123',
  port: 5432,
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
  )
`);

// Get all todos
app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos');
  res.json(result.rows);
});

// Add a todo
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const result = await pool.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
  res.json(result.rows[0]);
});

app.listen(5000, () => console.log('Backend running on port 5000'));