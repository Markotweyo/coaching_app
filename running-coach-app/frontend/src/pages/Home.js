// Home.js - placeholder

import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Dashboard from '../components/Dashboard';
import FeedbackCard from '../components/FeedbackCard';
import ActionPanel from '../components/ActionPanel';

function Home({ userName = 'Runner' }) { // Mock default name
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [weeklyStats] = useState({
    totalRuns: 4,
    totalDistance: 32,
    avgPace: 360,
    avgRecoveryScore: 85,
    runTypes: ['easy', 'tempo', 'long']
  });

  // Mock feedback data
  const feedbackItems = [
    {
      type: 'consistency',
      message: 'Great job maintaining consistent training! Consider adding one more easy run this week.',
      priority: 'Medium',
      details: {
        currentRuns: 4,
        targetRuns: 5
      }
    },
    {
      type: 'intensity',
      message: 'Your easy runs may be too fast. Try slowing down to improve recovery.',
      priority: 'High',
      details: {
        currentEasyPace: '5:30',
        recommendedEasyPace: '6:00'
      }
    }
  ];

  const handleFeedbackSelect = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleActionConfirm = () => {
    // Handle applying the changes
    setSelectedFeedback(null);
  };

  const handleActionCancel = () => {
    setSelectedFeedback(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {userName}!
        </Typography>
      </Box>

      <Dashboard 
        weeklyStats={weeklyStats}
        loading={false}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Training Feedback
        </Typography>
        
        {feedbackItems.map((feedback, index) => (
          <FeedbackCard
            key={index}
            feedback={feedback}
            onApply={() => handleFeedbackSelect(feedback)}
          />
        ))}
      </Box>

      {selectedFeedback && (
        <ActionPanel
          suggestion={{
            description: selectedFeedback.message,
            affectedWorkouts: [
              {
                runType: 'easy',
                distance: 5,
                pace: 360,
                date: new Date().toISOString()
              }
            ]
          }}
          onConfirm={handleActionConfirm}
          onCancel={handleActionCancel}
        />
      )}
    </Container>
  );
}

export default Home;
