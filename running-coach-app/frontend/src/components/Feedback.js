import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { formatPace, formatDistance } from '../utils/formatters';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  DirectionsRun as DirectionsRunIcon,
  Refresh as RefreshIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

const Feedback = () => {
  const { data, loading, error, execute } = useApi();
  const [feedback, setFeedback] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const result = await execute('/api/feedback');
      if (result) {
        setFeedback(result.feedback);
        setWeeklyStats(result.weeklyStats);
      }
    };
    fetchFeedback();
  }, [execute]);

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'consistency':
        return <TrendingUpIcon />;
      case 'pace':
        return <SpeedIcon />;
      case 'recovery':
        return <RefreshIcon />;
      case 'variety':
        return <DirectionsRunIcon />;
      default:
        return <EmojiEventsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading feedback: {error}
      </Alert>
    );
  }

  if (!feedback || !weeklyStats) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Running Coach Feedback
      </Typography>

      {/* Main Feedback Card */}
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            {getFeedbackIcon(feedback.type)}
            <Typography variant="h6">
              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)} Focus
            </Typography>
            <Chip
              label={feedback.priority.toUpperCase()}
              color={getPriorityColor(feedback.priority)}
              size="small"
            />
          </Stack>
          <Typography variant="body1" paragraph>
            {feedback.message}
          </Typography>
        </CardContent>
      </Card>

      {/* Weekly Stats Summary */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          This Week's Summary
        </Typography>
        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsRunIcon color="primary" />
              <Typography>
                {weeklyStats.totalRuns} runs
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimerIcon color="primary" />
              <Typography>
                {formatDistance(weeklyStats.totalDistance)} km
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <SpeedIcon color="primary" />
              <Typography>
                {formatPace(weeklyStats.avgPace)} /km
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Detailed Analysis */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Detailed Analysis
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Recovery Score
            </Typography>
            <Typography>
              {weeklyStats.avgRecoveryScore.toFixed(1)} / 10
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Run Types
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {weeklyStats.runTypes.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Feedback; 