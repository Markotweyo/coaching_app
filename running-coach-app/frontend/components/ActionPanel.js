// ActionPanel.js - placeholder
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { RUN_TYPES } from '../constants';

const ActionPanel = ({ suggestion, onConfirm, onCancel }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatPace = (paceInSeconds) => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = paceInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatWorkoutDetails = (workout) => {
    if (!workout) return null;
    
    return (
      <List dense>
        <ListItem>
          <ListItemIcon>
            <RunIcon />
          </ListItemIcon>
          <ListItemText 
            primary={`Type: ${workout.runType.charAt(0).toUpperCase() + workout.runType.slice(1)}`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <TimerIcon />
          </ListItemIcon>
          <ListItemText 
            primary={`Distance: ${workout.distance}km at ${formatPace(workout.pace)}/km`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CalendarIcon />
          </ListItemIcon>
          <ListItemText 
            primary={`Date: ${new Date(workout.date).toLocaleDateString()}`}
          />
        </ListItem>
      </List>
    );
  };

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Proposed Changes
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {suggestion.description}
        </Typography>
      </Box>

      <Button
        variant="text"
        onClick={() => setShowDetails(!showDetails)}
        endIcon={<ExpandMoreIcon />}
        sx={{ mb: 1 }}
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </Button>

      <Collapse in={showDetails}>
        <Box sx={{ mb: 2 }}>
          {suggestion.affectedWorkouts?.map((workout) => (
            <React.Fragment key={`${workout.date}-${workout.runType}`}>
              {formatWorkoutDetails(workout)}
              {workout !== suggestion.affectedWorkouts[suggestion.affectedWorkouts.length - 1] && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button 
          variant="outlined" 
          color="error" 
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
      </Box>
    </Paper>
  );
};

ActionPanel.propTypes = {
  suggestion: PropTypes.shape({
    description: PropTypes.string.isRequired,
    affectedWorkouts: PropTypes.arrayOf(PropTypes.shape({
      runType: PropTypes.oneOf(Object.values(RUN_TYPES)).isRequired,
      distance: PropTypes.number.isRequired,
      pace: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    }))
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ActionPanel;
