import React, { useEffect } from 'react';
import { Container, Grid, Paper, Typography, Alert } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { runService, feedbackService } from '../services/api';
import { useApi } from '../hooks/useApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const userId = 'user123'; // In a real app, this would come from authentication
  const currentDate = new Date();
  const currentWeek = Math.ceil((currentDate.getDate() + currentDate.getDay()) / 7);

  const { 
    data: weeklyStats, 
    loading: statsLoading, 
    error: statsError,
    execute: fetchStats 
  } = useApi(() => runService.getWeeklyStats(userId, currentDate.getFullYear(), currentWeek));

  const { 
    data: feedback, 
    loading: feedbackLoading, 
    error: feedbackError,
    execute: fetchFeedback 
  } = useApi(() => feedbackService.getRecommendations(userId));

  useEffect(() => {
    fetchStats();
    fetchFeedback();
  }, [fetchStats, fetchFeedback]);

  if (statsLoading || feedbackLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (statsError || feedbackError) {
    return (
      <Container>
        <Alert severity="error">
          {statsError || feedbackError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Weekly Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Weekly Summary
            </Typography>
            {weeklyStats && (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Total Runs</Typography>
                  <Typography variant="h4">{weeklyStats.totalRuns}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Total Distance</Typography>
                  <Typography variant="h4">{weeklyStats.totalDistance.toFixed(1)} km</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Avg Pace</Typography>
                  <Typography variant="h4">
                    {Math.floor(weeklyStats.avgPace / 60)}:{String(Math.floor(weeklyStats.avgPace % 60)).padStart(2, '0')} /km
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {feedback?.recommendation && (
              <>
                <Typography variant="subtitle1" color="primary">
                  {feedback.recommendation.type}
                </Typography>
                <Typography variant="body1">{feedback.recommendation.message}</Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 