import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Refresh as RecoveryIcon
} from '@mui/icons-material';
import { formatPace, formatDistance } from '../utils/formatters';

const StatCard = ({ icon, title, value, unit }) => (
  <Card>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: 'primary.main' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" component="div">
            {value}{unit}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const Dashboard = ({ weeklyStats, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        This Week's Progress
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<RunIcon />}
            title="Total Runs"
            value={weeklyStats.totalRuns}
            unit=" runs"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TimerIcon />}
            title="Total Distance"
            value={formatDistance(weeklyStats.totalDistance)}
            unit=" km"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SpeedIcon />}
            title="Average Pace"
            value={formatPace(weeklyStats.avgPace)}
            unit=" /km"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<RecoveryIcon />}
            title="Recovery Score"
            value={weeklyStats.avgRecoveryScore}
            unit="/10"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 