const express = require('express');
const cors = require('cors');

const app = express();

const pool = require('./db/db');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('API is running');
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user.routes')
app.use('/api/users', userRoutes);



module.exports = app;
