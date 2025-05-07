import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Divider
} from '@mui/material';
import { formatPace, formatDistance } from '../utils/formatters';

const ActionPanel = ({ suggestion, onConfirm, onCancel }) => {
  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Suggested Changes
      </Typography>
      
      <Typography variant="body1" paragraph>
        {suggestion.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Affected Workouts:
      </Typography>

      {suggestion.affectedWorkouts.map((workout, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {new Date(workout.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              {workout.runType.charAt(0).toUpperCase() + workout.runType.slice(1)} Run
            </Typography>
            <Typography variant="body2">
              {formatDistance(workout.distance)} km
            </Typography>
            <Typography variant="body2">
              {formatPace(workout.pace)} /km
            </Typography>
          </Stack>
        </Box>
      ))}

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
        >
          Apply Changes
        </Button>
      </Stack>
    </Paper>
  );
};

export default ActionPanel; 