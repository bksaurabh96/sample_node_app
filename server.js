// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Use a connection string or discrete fields – both shown below.
// Recommended: single POSTGRES_CONNECTION_STRING secret in GitHub/Azure.

const connectionString =
  process.env.POSTGRES_CONNECTION_STRING ||
  `postgresql://${encodeURIComponent(process.env.POSTGRES_USER)}:${encodeURIComponent(
    process.env.POSTGRES_PASSWORD
  )}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // for Azure Database for PostgreSQL
  }
});

app.get('/', (req, res) => {
  res.send('Node sample running on Azure App Service');
});

// Simple endpoint that reads from Postgres
app.get('/db-time', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    res.json({
      ok: true,
      time: result.rows[0].server_time
    });
  } catch (err) {
    console.error('Error querying Postgres:', err);
    res.status(500).json({ ok: false, error: 'Database query failed' });
  }
});

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});