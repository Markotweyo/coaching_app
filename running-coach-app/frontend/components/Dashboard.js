// Dashboard.js - placeholder


import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  Timer as TimerIcon,
  Favorite as RecoveryIcon,
  Speed as PaceIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import FeedbackCard from './FeedbackCard';

const Dashboard = ({ weeklyStats, recommendation, loading, historicalData }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const formatPace = (paceInSeconds) => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = paceInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateConsistencyScore = (stats) => {
    const targetRuns = 4; // Weekly target runs
    return Math.min(((stats?.totalRuns || 0) / targetRuns) * 100, 100);
  };

  const paceChartData = {
    labels: historicalData?.dates || [],
    datasets: [{
      label: 'Average Pace (min/km)',
      data: historicalData?.paces || [],
      fill: false,
      borderColor: '#2196f3',
      tension: 0.1
    }]
  };

  const recoveryChartData = {
    labels: historicalData?.dates || [],
    datasets: [{
      label: 'Recovery Score',
      data: historicalData?.recoveryScores || [],
      fill: true,
      backgroundColor: 'rgba(245, 0, 87, 0.1)',
      borderColor: '#f50057',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Average Pace Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PaceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Pace</Typography>
              </Box>
              <Typography variant="h4">
                {weeklyStats?.avgPace ? formatPace(weeklyStats.avgPace) : '--:--'} /km
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Consistency Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RunIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Consistency</Typography>
              </Box>
              <Typography variant="h4">
                {calculateConsistencyScore(weeklyStats)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {weeklyStats?.totalRuns || 0} runs this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Score Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RecoveryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recovery</Typography>
              </Box>
              <Typography variant="h4">
                {weeklyStats?.avgRecoveryScore ? 
                  weeklyStats.avgRecoveryScore.toFixed(1) : '--'}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Distance Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Distance</Typography>
              </Box>
              <Typography variant="h4">
                {weeklyStats?.totalDistance?.toFixed(1) || '0'} km
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pace Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Pace Trends</Typography>
            <Line data={paceChartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Recovery Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recovery Trends</Typography>
            <Line data={recoveryChartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* AI Feedback Preview */}
        <Grid item xs={12}>
          {recommendation && (
            <FeedbackCard
              feedback={recommendation}
              onApply={() => {}}
              onEdit={() => {}}
              onDismiss={() => {}}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

Dashboard.propTypes = {
    weeklyStats: PropTypes.shape({
      totalRuns: PropTypes.number,
      totalDistance: PropTypes.number,
      avgPace: PropTypes.number,
      avgRecoveryScore: PropTypes.number,
      runTypes: PropTypes.arrayOf(PropTypes.string)
    }),
    recommendation: PropTypes.shape({
      type: PropTypes.string,
      details: PropTypes.object,
      description: PropTypes.string
    }),
    loading: PropTypes.bool,
    historicalData: PropTypes.shape({
      dates: PropTypes.arrayOf(PropTypes.string),
      paces: PropTypes.arrayOf(PropTypes.number),
      recoveryScores: PropTypes.arrayOf(PropTypes.number)
    })
  };
export default Dashboard;



