// languageTemplates.js - placeholder
/**
 * Generates coach-like, conversational feedback messages based on feedback type
 * @param {string} feedbackType - Type of feedback to generate a message for
 * @param {Object} data - Additional data to personalize the message
 * @param {string} data.userName - User's name for personalization
 * @param {Object} data.details - Optional details to include in the message
 * @returns {string} Personalized coaching message
 */
function generateCoachingMessage(feedbackType, data = {}) {
  const { userName = 'Runner', details = {} } = data;
  
  const templates = {
    // Recovery-related messages
    rest: `${userName}, I notice your recovery scores are quite low (${details.recoveryScore || 'below 4'}/10). Your body needs time to rebuild - let's add a rest day or some light cross-training to help you bounce back stronger.`,
    
    // Training volume messages
    consistency: `Hey ${userName}, you're ${details.missedRuns || 'a few'} runs behind your weekly target. Let's get back on track with a short, easy run to maintain your fitness momentum.`,
    distance: `${userName}, you're about ${details.distanceDeficit ? details.distanceDeficit.toFixed(1) : '5+'}km short of your weekly distance goal. Consider extending your next run by a few kilometers to close that gap.`,
    
    // Training variety messages
    variety: `${userName}, I'd recommend adding a long run to your weekly routine. It'll build your endurance base and make your other runs feel easier over time.`,
    intensity: `${userName}, your training could use some intensity. A tempo run or interval session would be great to boost your speed and lactate threshold.`,
    
    // Pace-related messages
    easyPaceTooFast: `I've noticed your easy runs are nearly as fast as your tempo runs, ${userName}. Remember that easy days should actually feel easy - try slowing down by 30-60 seconds per km to truly recover between harder efforts.`,
    paceInconsistent: `${userName}, your pacing seems a bit erratic. Try to maintain a more consistent effort level during your runs - it'll help build efficiency and prevent burnout.`,
    
    // Positive reinforcement
    maintain: `Great job staying consistent with your training, ${userName}! You're right on track with your goals. Keep up the solid work and you'll continue to see progress.`,
    
    // Default message if no specific feedback type matches
    default: `Keep moving forward, ${userName}! Consistency is the key to improvement in running.`
  };
  
  return templates[feedbackType] || templates.default;
}

module.exports = {
  generateCoachingMessage
};
