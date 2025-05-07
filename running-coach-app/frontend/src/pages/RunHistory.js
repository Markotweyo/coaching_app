import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { runService } from '../services/api';

function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      const userId = 'user123'; // In a real app, this would come from authentication
      const response = await runService.getRuns(userId);
      setRuns(response.data);
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (runId) => {
    if (window.confirm('Are you sure you want to delete this run?')) {
      try {
        await runService.deleteRun(runId);
        fetchRuns(); // Refresh the list
      } catch (error) {
        console.error('Error deleting run:', error);
        alert('Error deleting run. Please try again.');
      }
    }
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Run History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Pace</TableCell>
                <TableCell>Recovery</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run._id}>
                  <TableCell>
                    {new Date(run.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {run.runType.charAt(0).toUpperCase() + run.runType.slice(1)}
                  </TableCell>
                  <TableCell>{run.distance.toFixed(1)}</TableCell>
                  <TableCell>{formatDuration(run.duration)}</TableCell>
                  <TableCell>{formatPace(run.pace)}</TableCell>
                  <TableCell>{run.recoveryScore || '-'}</TableCell>
                  <TableCell>{run.location}</TableCell>
                  <TableCell>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(run._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default RunHistory; 