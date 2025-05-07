import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Box
} from '@mui/material';
import {
  TrendingUp as ConsistencyIcon,
  Speed as PaceIcon,
  Refresh as RecoveryIcon,
  DirectionsRun as VarietyIcon
} from '@mui/icons-material';

const getFeedbackIcon = (type) => {
  switch (type) {
    case 'consistency':
      return <ConsistencyIcon />;
    case 'pace':
      return <PaceIcon />;
    case 'recovery':
      return <RecoveryIcon />;
    case 'variety':
      return <VarietyIcon />;
    default:
      return null;
  }
};

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'success';
  }
};

const FeedbackCard = ({ feedback, onApply }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box sx={{ color: 'primary.main' }}>
            {getFeedbackIcon(feedback.type)}
          </Box>
          <Typography variant="h6" component="div">
            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
          </Typography>
          <Chip
            label={feedback.priority}
            color={getPriorityColor(feedback.priority)}
            size="small"
          />
        </Stack>
        
        <Typography variant="body1" paragraph>
          {feedback.message}
        </Typography>

        {feedback.details && (
          <Box sx={{ mt: 2 }}>
            {Object.entries(feedback.details).map(([key, value]) => (
              <Typography key={key} variant="body2" color="text.secondary">
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onApply}
          >
            Apply Changes
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard; 