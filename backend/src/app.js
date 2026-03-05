const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const authRoutes = require("./routes/auth.routes");


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/auth", authRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running 🚀' });
});

module.exports = app;
