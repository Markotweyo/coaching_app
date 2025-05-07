import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box
} from '@mui/material';
import { runService } from '../services/api';
import { RUN_TYPES } from '../constants';

function AddRun() {
  const [formData, setFormData] = useState({
    distance: '',
    duration: '',
    runType: RUN_TYPES.EASY,
    recoveryScore: '',
    notes: '',
    location: '',
    weather: {
      temperature: '',
      conditions: ''
    },
    elevationGain: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert duration from MM:SS to seconds
      const [minutes, seconds] = formData.duration.split(':').map(Number);
      const durationInSeconds = minutes * 60 + seconds;
      
      // Calculate pace (seconds per kilometer)
      const pace = durationInSeconds / formData.distance;

      const runData = {
        ...formData,
        duration: durationInSeconds,
        pace,
        userId: 'user123', // In a real app, this would come from authentication
        date: new Date().toISOString()
      };

      await runService.addRun(runData);
      // Reset form
      setFormData({
        distance: '',
        duration: '',
        runType: RUN_TYPES.EASY,
        recoveryScore: '',
        notes: '',
        location: '',
        weather: {
          temperature: '',
          conditions: ''
        },
        elevationGain: ''
      });
      alert('Run added successfully!');
    } catch (error) {
      console.error('Error adding run:', error);
      alert('Error adding run. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Run
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Distance (km)"
                name="distance"
                type="number"
                value={formData.distance}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (MM:SS)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="MM:SS"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Run Type"
                name="runType"
                value={formData.runType}
                onChange={handleChange}
                required
              >
                {Object.values(RUN_TYPES).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recovery Score (1-10)"
                name="recoveryScore"
                type="number"
                value={formData.recoveryScore}
                onChange={handleChange}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperature (°C)"
                name="weather.temperature"
                type="number"
                value={formData.weather.temperature}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weather Conditions"
                name="weather.conditions"
                value={formData.weather.conditions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Elevation Gain (m)"
                name="elevationGain"
                type="number"
                value={formData.elevationGain}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Add Run
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddRun; 