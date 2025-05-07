const express = require('express');
const router = express.Router();
const { RunData } = require('../models/runData');

// Get all runs for a user
router.get('/:userId', async (req, res) => {
  try {
    const runs = await RunData.find({ userId: req.params.userId });
    res.json(runs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new run
router.post('/', async (req, res) => {
  const runData = new RunData(req.body);
  try {
    const newRun = await runData.save();
    res.status(201).json(newRun);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get weekly stats
router.get('/:userId/weekly/:year/:week', async (req, res) => {
  try {
    const stats = await RunData.getWeeklyAggregation(
      req.params.userId,
      parseInt(req.params.year),
      parseInt(req.params.week)
    );
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a run
router.patch('/:id', async (req, res) => {
  try {
    const run = await RunData.findById(req.params.id);
    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }
    Object.assign(run, req.body);
    const updatedRun = await run.save();
    res.json(updatedRun);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a run
router.delete('/:id', async (req, res) => {
  try {
    const run = await RunData.findById(req.params.id);
    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }
    await run.remove();
    res.json({ message: 'Run deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test route to create sample data
router.post('/test/sample-data', async (req, res) => {
  try {
    const sampleRun = new RunData({
      userId: 'user123',
      date: new Date(),
      distance: 5,
      duration: 1800, // 30 minutes
      pace: 360, // 6:00/km
      runType: 'easy',
      recoveryScore: 8,
      location: 'Central Park',
      weather: {
        temperature: 20,
        conditions: 'Sunny'
      }
    });
    
    await sampleRun.save();
    res.status(201).json(sampleRun);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 