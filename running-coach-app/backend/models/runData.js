const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the run types as constants
const RUN_TYPES = {
  EASY: 'easy',
  TEMPO: 'tempo',
  INTERVAL: 'interval',
  LONG: 'long',
  RACE: 'race',
  RECOVERY: 'recovery'
};

// Create the schema for run data
const RunDataSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  distance: {
    type: Number,  // in kilometers
    required: true
  },
  duration: {
    type: Number,  // in seconds
    required: true
  },
  pace: {
    type: Number,  // in seconds per kilometer
    required: true
  },
  runType: {
    type: String,
    enum: Object.values(RUN_TYPES),
    required: true
  },
  recoveryScore: {
    type: Number,  // scale of 1-10
    min: 1,
    max: 10
  },
  heartRate: {
    average: Number,
    max: Number
  },
  notes: String,
  location: String,
  weather: {
    temperature: Number,
    conditions: String
  },
  elevationGain: Number,  // in meters
  weekNumber: Number,
  yearNumber: Number
});

// Pre-save middleware to calculate pace if not provided
RunDataSchema.pre('save', function(next) {
  if (!this.pace && this.duration && this.distance) {
    this.pace = this.duration / this.distance;
  }
  
  // Calculate week number and year for aggregation purposes
  const date = this.date || new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  this.weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  this.yearNumber = date.getFullYear();
  
  next();
});

// Method to get weekly aggregated data
RunDataSchema.statics.getWeeklyAggregation = async function(userId, year, week) {
  return this.aggregate([
    {
      $match: {
        userId: userId,
        yearNumber: year,
        weekNumber: week
      }
    },
    {
      $group: {
        _id: null,
        totalRuns: { $sum: 1 },
        totalDistance: { $sum: "$distance" },
        totalDuration: { $sum: "$duration" },
        avgPace: { $avg: "$pace" },
        avgRecoveryScore: { $avg: "$recoveryScore" },
        runTypes: { $push: "$runType" }
      }
    },
    {
      $project: {
        _id: 0,
        totalRuns: 1,
        totalDistance: 1,
        totalDuration: 1,
        avgPace: 1,
        avgRecoveryScore: 1,
        runTypes: 1
      }
    }
  ]);
};

// Create and export the model
const RunData = mongoose.model('RunData', RunDataSchema);

module.exports = {
  RunData,
  RUN_TYPES
};
