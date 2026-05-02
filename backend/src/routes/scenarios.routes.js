const express = require('express');
const router = express.Router();
const scenarios = require('../scenarios/prompts');

// GET /api/scenarios - List all available scenarios
router.get('/', (req, res) => {
  const scenarioList = Object.values(scenarios).map(s => ({
    id: s.id,
    title: s.title,
    description: s.description
  }));
  
  res.json({ scenarios: scenarioList });
});

module.exports = router;