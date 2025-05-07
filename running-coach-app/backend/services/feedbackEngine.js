// feedbackEngine.js - placeholder
const { RunData, RUN_TYPES } = require('../models/runData');

const templates = {
  consistency: {
    low: [
      "I notice you've been running less frequently than usual. Remember, consistency is key to improvement!",
      "Your running schedule seems a bit irregular. Let's aim for at least {targetRuns} runs per week.",
      "I see you're taking more rest days than planned. While rest is important, maintaining a regular schedule will help build your endurance."
    ],
    medium: [
      "You're maintaining a decent running schedule. Keep it up!",
      "Good consistency this week. Try to maintain this rhythm.",
      "Your running frequency is on track. Consider adding one more run next week for better progress."
    ],
    high: [
      "Excellent consistency! You're really sticking to your training plan.",
      "Impressive dedication to your running schedule!",
      "You're showing great commitment to your training. This consistency will pay off!"
    ]
  },
  pace: {
    tooFast: [
      "I notice your easy runs are a bit too fast. Remember, easy runs should feel comfortable and conversational.",
      "Your pace on recovery runs is higher than recommended. Let's slow it down to build endurance.",
      "Try to keep your easy runs at a more relaxed pace. This will help with recovery and long-term progress."
    ],
    tooSlow: [
      "Your pace has been slower than usual. Are you feeling tired or recovering from something?",
      "I notice your recent runs have been at a slower pace. Let's check if you need more recovery time.",
      "Your pace is below your usual range. Consider if you need to adjust your training load."
    ],
    optimal: [
      "Great pace control! You're maintaining the right intensity for each run type.",
      "Excellent pace management across your different types of runs.",
      "Your pace is spot on for your current training phase. Keep it up!"
    ]
  },
  recovery: {
    low: [
      "Your recovery scores are quite low. Consider taking an extra rest day or doing some light cross-training.",
      "I notice you're not recovering well between runs. Let's focus on proper rest and nutrition.",
      "Your body might need more recovery time. Consider reducing intensity for a few days."
    ],
    medium: [
      "Your recovery is on track. Keep monitoring how you feel.",
      "Good recovery management. Continue listening to your body.",
      "Your recovery scores are in a healthy range. Maintain this balance."
    ],
    high: [
      "Excellent recovery! Your body is adapting well to the training.",
      "Great job on recovery! You're finding the right balance between training and rest.",
      "Your recovery scores are impressive. This shows good training management."
    ]
  },
  variety: {
    low: [
      "I notice you're doing similar types of runs. Let's add some variety to your training.",
      "Your training could benefit from more variety. Consider adding some speed work or long runs.",
      "Try mixing up your run types to improve different aspects of your fitness."
    ],
    medium: [
      "Good variety in your training. Keep this balanced approach.",
      "You're maintaining a nice mix of different run types. This is great for overall development.",
      "Your training variety is on point. Continue this balanced approach."
    ],
    high: [
      "Excellent training variety! You're covering all the important aspects of running.",
      "Great job mixing up your run types. This comprehensive approach will lead to better results.",
      "Your training variety is impressive. This balanced approach is perfect for long-term progress."
    ]
  }
};

function getRandomTemplate(category, level) {
  const categoryTemplates = templates[category][level];
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
}

function analyzeConsistency(stats, goals) {
  const consistencyScore = (stats.totalRuns / goals.weeklyRunTarget) * 100;
  if (consistencyScore < 50) return { level: 'low', score: consistencyScore };
  if (consistencyScore < 80) return { level: 'medium', score: consistencyScore };
  return { level: 'high', score: consistencyScore };
}

function analyzePace(stats, goals) {
  const avgPace = stats.avgPace;
  if (avgPace < 300) return { level: 'tooFast', pace: avgPace };
  if (avgPace > 420) return { level: 'tooSlow', pace: avgPace };
  return { level: 'optimal', pace: avgPace };
}

function analyzeRecovery(stats) {
  const recoveryScore = stats.avgRecoveryScore;
  if (recoveryScore < 6) return { level: 'low', score: recoveryScore };
  if (recoveryScore < 8) return { level: 'medium', score: recoveryScore };
  return { level: 'high', score: recoveryScore };
}

function analyzeVariety(stats) {
  const uniqueRunTypes = new Set(stats.runTypes).size;
  if (uniqueRunTypes < 2) return { level: 'low', types: uniqueRunTypes };
  if (uniqueRunTypes < 3) return { level: 'medium', types: uniqueRunTypes };
  return { level: 'high', types: uniqueRunTypes };
}

function getPriorityLevel(priorityValue) {
  if (priorityValue === 3) return 'high';
  if (priorityValue === 2) return 'medium';
  return 'low';
}

function generateRecommendation(stats, goals) {
  const analyses = {
    consistency: analyzeConsistency(stats, goals),
    pace: analyzePace(stats, goals),
    recovery: analyzeRecovery(stats),
    variety: analyzeVariety(stats)
  };

  // Determine the most important feedback to give
  const priorities = {
    consistency: analyses.consistency.level === 'low' ? 3 : 1,
    pace: analyses.pace.level === 'tooFast' ? 2 : 1,
    recovery: analyses.recovery.level === 'low' ? 3 : 1,
    variety: analyses.variety.level === 'low' ? 2 : 1
  };

  const highestPriority = Object.entries(priorities)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  const feedback = {
    type: highestPriority,
    message: getRandomTemplate(highestPriority, analyses[highestPriority].level),
    priority: getPriorityLevel(priorities[highestPriority]),
    details: {
      ...analyses[highestPriority],
      weeklyStats: stats
    }
  };

  return feedback;
}

/**
 * Analyzes pace variability across different run types
 * @param {Array} runs - Array of run data objects
 * @returns {Object} Pace analysis with recommendations
 */
function analyzePaceVariability(runs) {
  if (!runs || runs.length < 3) {
    return {
      message: 'Not enough run data to analyze pace variability.',
      hasSufficientData: false
    };
  }

  // Group runs by type
  const runsByType = {};
  Object.values(RUN_TYPES).forEach(type => {
    runsByType[type] = runs.filter(run => run.runType === type);
  });

  const analysis = {
    hasSufficientData: true,
    message: '',
    details: {}
  };

  // Check if easy runs are actually easy
  if (runsByType[RUN_TYPES.EASY].length > 0 && runsByType[RUN_TYPES.TEMPO].length > 0) {
    const avgEasyPace = runsByType[RUN_TYPES.EASY].reduce((sum, run) => sum + run.pace, 0) / 
                        runsByType[RUN_TYPES.EASY].length;
    const avgTempoPace = runsByType[RUN_TYPES.TEMPO].reduce((sum, run) => sum + run.pace, 0) / 
                         runsByType[RUN_TYPES.TEMPO].length;
    
    // If easy pace is too close to tempo pace (less than 15% difference)
    if ((avgEasyPace / avgTempoPace) < 1.15) {
      analysis.message = 'Your easy runs may be too fast. Consider slowing down to improve recovery.';
      analysis.details.easyPaceTooFast = true;
      analysis.details.easyTempoRatio = avgEasyPace / avgTempoPace;
    }
  }

  return analysis;
}

module.exports = {
  generateRecommendation,
  analyzePaceVariability
};

