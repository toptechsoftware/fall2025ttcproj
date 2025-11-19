const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_y9VpPNqkfA8n@ep-long-night-ah10hsux-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });

async function init() {
    await pool.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}

module.exports = { pool, init };
