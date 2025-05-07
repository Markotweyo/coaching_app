import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { feedbackService } from '../services/api';

function Feedback() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const userId = 'user123'; // In a real app, this would come from authentication
      const response = await feedbackService.getRecommendations(userId);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Training Recommendations
            </Typography>
            {feedback?.recommendation && (
              <Box>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  {feedback.recommendation.type.toUpperCase()}
                </Typography>
                <Typography variant="body1" paragraph>
                  {feedback.recommendation.message}
                </Typography>
                {feedback.recommendation.details && (
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(feedback.recommendation.details).map(([key, value]) => (
                      <Typography key={key} variant="body2" color="text.secondary">
                        {key}: {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Pace Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pace Analysis
            </Typography>
            {feedback?.paceAnalysis && (
              <Box>
                <Typography variant="body1" paragraph>
                  {feedback.paceAnalysis.message}
                </Typography>
                {feedback.paceAnalysis.details && (
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(feedback.paceAnalysis.details).map(([key, value]) => (
                      <Typography key={key} variant="body2" color="text.secondary">
                        {key}: {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Weekly Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Statistics
            </Typography>
            {feedback?.weeklyStats && (
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Runs
                  </Typography>
                  <Typography variant="h4">
                    {feedback.weeklyStats.totalRuns}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Distance
                  </Typography>
                  <Typography variant="h4">
                    {feedback.weeklyStats.totalDistance.toFixed(1)} km
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Pace
                  </Typography>
                  <Typography variant="h4">
                    {Math.floor(feedback.weeklyStats.avgPace / 60)}:
                    {String(Math.floor(feedback.weeklyStats.avgPace % 60)).padStart(2, '0')}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recovery Score
                  </Typography>
                  <Typography variant="h4">
                    {feedback.weeklyStats.avgRecoveryScore?.toFixed(1) || '-'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Feedback; 