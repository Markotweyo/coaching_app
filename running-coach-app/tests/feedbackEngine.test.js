// feedbackEngine.test.js - placeholder
const { generateRecommendation, analyzePaceVariability } = require('../backend/services/feedbackEngine');
const { RUN_TYPES } = require('../backend/models/runData');

describe('Feedback Engine', () => {
  describe('generateRecommendation', () => {
    test('should recommend rest when recovery score is low', () => {
      const weeklyStats = {
        totalRuns: 4,
        totalDistance: 30,
        avgPace: 360,
        avgRecoveryScore: 3.5,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.EASY, RUN_TYPES.TEMPO, RUN_TYPES.LONG]
      };
      
      const recommendation = generateRecommendation(weeklyStats);
      
      expect(recommendation.type).toBe('rest');
      expect(recommendation.details.recoveryScore).toBe(3.5);
    });

    test('should recommend consistency when runs are below target', () => {
      const weeklyStats = {
        totalRuns: 2,
        totalDistance: 15,
        avgPace: 350,
        avgRecoveryScore: 7,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.EASY]
      };
      
      const userGoals = {
        weeklyRunTarget: 4,
        weeklyDistanceTarget: 30
      };
      
      const recommendation = generateRecommendation(weeklyStats, userGoals);
      
      expect(recommendation.type).toBe('consistency');
      expect(recommendation.details.missedRuns).toBe(2);
    });

    test('should recommend increasing distance when below target', () => {
      const weeklyStats = {
        totalRuns: 4,
        totalDistance: 20,
        avgPace: 350,
        avgRecoveryScore: 7,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.EASY, RUN_TYPES.TEMPO, RUN_TYPES.EASY]
      };
      
      const userGoals = {
        weeklyRunTarget: 4,
        weeklyDistanceTarget: 30
      };
      
      const recommendation = generateRecommendation(weeklyStats, userGoals);
      
      expect(recommendation.type).toBe('distance');
      expect(recommendation.details.distanceDeficit).toBe(10);
    });

    test('should recommend adding a long run for variety', () => {
      const weeklyStats = {
        totalRuns: 4,
        totalDistance: 30,
        avgPace: 350,
        avgRecoveryScore: 7,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.EASY, RUN_TYPES.TEMPO, RUN_TYPES.EASY]
      };
      
      const userGoals = {
        weeklyRunTarget: 4,
        weeklyDistanceTarget: 30
      };
      
      const recommendation = generateRecommendation(weeklyStats, userGoals);
      
      expect(recommendation.type).toBe('variety');
    });

    test('should recommend adding intensity when no tempo/interval workouts', () => {
      const weeklyStats = {
        totalRuns: 4,
        totalDistance: 30,
        avgPace: 350,
        avgRecoveryScore: 7,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.EASY, RUN_TYPES.LONG, RUN_TYPES.EASY]
      };
      
      const userGoals = {
        weeklyRunTarget: 4,
        weeklyDistanceTarget: 30
      };
      
      const recommendation = generateRecommendation(weeklyStats, userGoals);
      
      expect(recommendation.type).toBe('intensity');
    });

    test('should recommend maintaining when all targets are met', () => {
      const weeklyStats = {
        totalRuns: 4,
        totalDistance: 32,
        avgPace: 350,
        avgRecoveryScore: 7,
        runTypes: [RUN_TYPES.EASY, RUN_TYPES.TEMPO, RUN_TYPES.LONG, RUN_TYPES.EASY]
      };
      
      const userGoals = {
        weeklyRunTarget: 4,
        weeklyDistanceTarget: 30
      };
      
      const recommendation = generateRecommendation(weeklyStats, userGoals);
      
      expect(recommendation.type).toBe('maintain');
      expect(recommendation.details.currentDistance).toBe(32);
    });
  });

  describe('analyzePaceVariability', () => {
    test('should return insufficient data when fewer than 3 runs', () => {
      const runs = [
        { runType: RUN_TYPES.EASY, pace: 360 },
        { runType: RUN_TYPES.TEMPO, pace: 300 }
      ];
      
      const analysis = analyzePaceVariability(runs);
      
      expect(analysis.hasSufficientData).toBe(false);
    });

    test('should identify when easy runs are too fast', () => {
      const runs = [
        { runType: RUN_TYPES.EASY, pace: 320 },
        { runType: RUN_TYPES.EASY, pace: 330 },
        { runType: RUN_TYPES.TEMPO, pace: 300 },
        { runType: RUN_TYPES.TEMPO, pace: 310 }
      ];
      
      const analysis = analyzePaceVariability(runs);
      
      expect(analysis.hasSufficientData).toBe(true);
      expect(analysis.details.easyPaceTooFast).toBe(true);
    });

    test('should not flag pace issues when easy/tempo paces are appropriately different', () => {
      const runs = [
        { runType: RUN_TYPES.EASY, pace: 400 },
        { runType: RUN_TYPES.EASY, pace: 410 },
        { runType: RUN_TYPES.TEMPO, pace: 320 },
        { runType: RUN_TYPES.TEMPO, pace: 330 }
      ];
      
      const analysis = analyzePaceVariability(runs);
      
      expect(analysis.hasSufficientData).toBe(true);
      expect(analysis.details.easyPaceTooFast).toBeUndefined();
    });
  });
});
