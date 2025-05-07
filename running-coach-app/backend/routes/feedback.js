const express = require('express');
const router = express.Router();
const { RunData } = require('../models/runData');
const { generateRecommendation, analyzePaceVariability } = require('../services/feedbackEngine');
const { authenticateToken } = require('../middleware/auth');

// Get personalized feedback
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get the last 7 days of runs
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const runs = await RunData.find({
      userId: req.user.id,
      date: { $gte: oneWeekAgo }
    }).sort({ date: -1 });

    // Calculate weekly statistics
    const weeklyStats = {
      totalRuns: runs.length,
      totalDistance: runs.reduce((sum, run) => sum + run.distance, 0),
      avgPace: runs.length > 0 
        ? runs.reduce((sum, run) => sum + run.pace, 0) / runs.length 
        : 0,
      avgRecoveryScore: runs.length > 0
        ? runs.reduce((sum, run) => sum + run.recoveryScore, 0) / runs.length
        : 0,
      runTypes: runs.map(run => run.runType)
    };

    // Get user's goals (you might want to fetch these from a user settings collection)
    const userGoals = {
      weeklyRunTarget: 4, // Default target
      weeklyDistanceTarget: 30 // Default target in km
    };

    // Generate personalized feedback
    const feedback = generateRecommendation(weeklyStats, userGoals);

    res.json({
      feedback,
      weeklyStats
    });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ message: 'Error generating feedback' });
  }
});

// Get pace analysis for a user
router.get('/pace-analysis/:userId', async (req, res) => {
  try {
    const runs = await RunData.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(10); // Analyze last 10 runs

    const analysis = analyzePaceVariability(runs);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 