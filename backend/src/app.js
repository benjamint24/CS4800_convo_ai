const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const scenariosRoutes = require("./routes/scenarios.routes")

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/scenarios', scenariosRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running 🚀' });
});

module.exports = app;
