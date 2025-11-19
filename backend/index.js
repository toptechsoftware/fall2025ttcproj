const express = require('express');
const cors = require('cors');
const { pool, init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/todos', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(rows);
});

app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const { rows } = await pool.query('INSERT INTO todos(text) VALUES ($1) RETURNING *', [text]);
    res.json(rows[0]);
});

app.put('/api/todos/:id/toggle', async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
});

async function start() {
    try {
        await init();
        app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
}

start();
