// scheduler.js - placeholder
const { RunData, RUN_TYPES } = require('../models/runData');
const { generateCoachingMessage } = require('./languageTemplates');

/**
 * Adjusts a user's weekly workout plan based on accepted feedback
 * @param {string} userId - The user's ID
 * @param {Object} feedback - The feedback object that was accepted
 * @param {string} feedback.type - Type of feedback (rest, consistency, etc.)
 * @param {Object} feedback.details - Additional details about the feedback
 * @param {Object} currentPlan - Current weekly workout plan (optional)
 * @returns {Object} Updated workout plan with adjustments
 */
async function adjustWorkoutPlan(userId, feedback, currentPlan = null) {
  if (!currentPlan) {
    currentPlan = await getCurrentWeekPlan(userId);
  }

  const adjustedPlan = { ...currentPlan };
  const today = new Date();
  
  switch (feedback.type) {
    case 'rest':
      handleRestAdjustment(adjustedPlan, today);
      break;
    case 'consistency':
      handleConsistencyAdjustment(adjustedPlan);
      break;
    case 'distance':
      handleDistanceAdjustment(adjustedPlan, feedback, today);
      break;
    case 'variety':
      handleVarietyAdjustment(adjustedPlan);
      break;
    case 'intensity':
      handleIntensityAdjustment(adjustedPlan);
      break;
  }
  
  adjustedPlan.totalDistance = adjustedPlan.workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  adjustedPlan.totalWorkouts = adjustedPlan.workouts.filter(w => !w.isRest).length;
  
  return adjustedPlan;
}

function handleRestAdjustment(adjustedPlan, today) {
  for (let i = 0; i < adjustedPlan.workouts.length; i++) {
    const workout = adjustedPlan.workouts[i];
    const workoutDate = new Date(workout.date);
    
    if (workoutDate > today && 
        (workout.runType === RUN_TYPES.TEMPO || 
         workout.runType === RUN_TYPES.INTERVAL || 
         workout.runType === RUN_TYPES.LONG)) {
      
      adjustedPlan.workouts[i] = {
        ...workout,
        runType: 'rest',
        distance: 0,
        duration: 0,
        isRest: true,
        notes: 'Rest day added based on recovery feedback'
      };
      break;
    }
  }
  return adjustedPlan;
}

function handleConsistencyAdjustment(adjustedPlan) {
  const availableDays = findAvailableDays(adjustedPlan.workouts);
  if (availableDays.length > 0) {
    adjustedPlan.workouts.push({
      date: availableDays[0],
      runType: RUN_TYPES.EASY,
      distance: 4,
      duration: 1440,
      pace: 360,
      notes: 'Easy run added to improve weekly consistency'
    });
    adjustedPlan.workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return adjustedPlan;
}

function handleDistanceAdjustment(adjustedPlan, feedback, today) {
  const distanceDeficit = feedback.details.distanceDeficit || 5;
  let remainingDeficit = distanceDeficit;
  
  for (let i = 0; i < adjustedPlan.workouts.length; i++) {
    const workout = adjustedPlan.workouts[i];
    const workoutDate = new Date(workout.date);
    
    if (workoutDate > today && workout.runType !== 'rest' && remainingDeficit > 0) {
      const extraDistance = calculateExtraDistance(workout.runType, remainingDeficit);
      
      adjustedPlan.workouts[i] = {
        ...workout,
        distance: workout.distance + extraDistance,
        duration: Math.round(workout.duration * (1 + extraDistance / workout.distance)),
        notes: `${workout.notes || ''} Distance increased by ${extraDistance}km to meet weekly goal.`
      };
      
      remainingDeficit -= extraDistance;
    }
  }
  return adjustedPlan;
}

function calculateExtraDistance(runType, remainingDeficit) {
  if (runType === RUN_TYPES.EASY || runType === RUN_TYPES.RECOVERY) {
    return Math.min(2, remainingDeficit);
  }
  if (runType === RUN_TYPES.LONG) {
    return Math.min(3, remainingDeficit);
  }
  return Math.min(1, remainingDeficit);
}

function handleVarietyAdjustment(adjustedPlan) {
  const hasLongRun = adjustedPlan.workouts.some(w => w.runType === RUN_TYPES.LONG);
  if (!hasLongRun) {
    const availableDays = findAvailableDays(adjustedPlan.workouts);
    const weekendDays = availableDays.filter(date => {
      const day = new Date(date).getDay();
      return day === 0 || day === 6;
    });
    
    let longRunDay = null;
    if (weekendDays.length > 0) {
      longRunDay = weekendDays[0];
    } else if (availableDays.length > 0) {
      longRunDay = availableDays[0];
    }
    
    if (longRunDay) {
      adjustedPlan.workouts.push({
        date: longRunDay,
        runType: RUN_TYPES.LONG,
        distance: 10,
        duration: 3600,
        pace: 360,
        notes: 'Long run added to improve training variety'
      });
      adjustedPlan.workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }
  return adjustedPlan;
}

function handleIntensityAdjustment(adjustedPlan) {
  const hasIntensity = adjustedPlan.workouts.some(w => 
    w.runType === RUN_TYPES.TEMPO || w.runType === RUN_TYPES.INTERVAL);
  
  if (!hasIntensity) {
    const availableDays = findAvailableDays(adjustedPlan.workouts);
    const weekdayOptions = availableDays.filter(date => {
      const day = new Date(date).getDay();
      return day !== 0 && day !== 6;
    });
    
    let intensityDay = null;
    if (weekdayOptions.length > 0) {
      intensityDay = weekdayOptions[0];
    } else if (availableDays.length > 0) {
      intensityDay = availableDays[0];
    }
    
    if (intensityDay) {
      adjustedPlan.workouts.push({
        date: intensityDay,
        runType: RUN_TYPES.TEMPO,
        distance: 6,
        duration: 1800,
        pace: 300,
        notes: 'Tempo run added to improve speed and lactate threshold'
      });
      adjustedPlan.workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }
  return adjustedPlan;
}

/**
 * Gets the current week's workout plan for a user
 * @param {string} userId - The user's ID
 * @returns {Object} Current week's workout plan
 */
async function getCurrentWeekPlan(userId) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Fetch runs for the current week
  const runs = await RunData.find({
    userId: userId,
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek
    }
  }).sort({ date: 1 });
  
  // Format into a plan
  return {
    userId,
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
    workouts: runs.map(run => ({
      date: run.date,
      runType: run.runType,
      distance: run.distance,
      duration: run.duration,
      pace: run.pace,
      notes: run.notes,
      isRest: false,
      _id: run._id
    })),
    totalDistance: runs.reduce((sum, run) => sum + run.distance, 0),
    totalWorkouts: runs.length
  };
}

/**
 * Finds available days in the week for adding workouts
 * @param {Array} workouts - Current workouts in the plan
 * @returns {Array} Available dates for new workouts
 */
function findAvailableDays(workouts) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Create array of all days in the week
  const allDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    allDays.push(day);
  }
  
  // Filter out days that already have workouts and days in the past
  const workoutDays = workouts.map(w => new Date(w.date).toDateString());
  const availableDays = allDays.filter(day => {
    return day > now && !workoutDays.includes(day.toDateString());
  });
  
  return availableDays;
}

module.exports = {
  adjustWorkoutPlan,
  getCurrentWeekPlan
};

