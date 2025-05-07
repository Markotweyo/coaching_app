// FeedbackCard.js - placeholder
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  IconButton,
  Collapse,
  CardActions
} from '@mui/material';
import { 
  DirectionsRun as RunIcon,
  Timer as TimerIcon,
  Favorite as RecoveryIcon,
  Speed as PaceIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const FeedbackCard = ({ 
  feedback, 
  onApply, 
  onEdit, 
  onDismiss 
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Determine icon based on feedback type
  const getFeedbackIcon = (type) => {
    switch(type) {
      case 'rest':
      case 'recovery':
        return <RecoveryIcon color="error" />;
      case 'consistency':
      case 'variety':
        return <RunIcon color="primary" />;
      case 'distance':
        return <TimerIcon color="secondary" />;
      case 'intensity':
      case 'easyPaceTooFast':
      case 'paceInconsistent':
        return <PaceIcon color="warning" />;
      default:
        return <RunIcon />;
    }
  };

  // Get background color based on feedback type
  const getCardColor = (type) => {
    switch(type) {
      case 'rest':
        return '#ffebee'; // light red
      case 'maintain':
        return '#e8f5e9'; // light green
      case 'consistency':
      case 'distance':
        return '#e3f2fd'; // light blue
      case 'intensity':
      case 'variety':
        return '#fff8e1'; // light amber
      default:
        return '#ffffff'; // white
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        backgroundColor: getCardColor(feedback.type),
        boxShadow: 2,
        borderRadius: 2
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {getFeedbackIcon(feedback.type)}
          <Typography variant="h6" component="div" ml={1} fontWeight="bold">
            {feedback.type && feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)} Feedback
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.primary" paragraph>
          {feedback.message}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip 
            label={`Priority: ${feedback.priority || 'Medium'}`} 
            size="small" 
            color={feedback.priority === 'High' ? 'error' : 'primary'} 
            variant="outlined"
          />
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
      </CardContent>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {feedback.details && Object.entries(feedback.details).length > 0 && (
            <>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Details:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {Object.entries(feedback.details).map(([key, value]) => (
                  <Typography key={key} variant="body2" color="text.secondary">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: 
                    {typeof value === 'number' ? value.toFixed(2) : value.toString()}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Collapse>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="small" 
          onClick={() => onApply(feedback)}
        >
          Apply
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="small" 
          onClick={() => onEdit(feedback)}
        >
          Edit
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          onClick={() => onDismiss(feedback)}
        >
          Dismiss
        </Button>
      </CardActions>
    </Card>
  );
};

FeedbackCard.propTypes = {
  feedback: PropTypes.shape({
    type: PropTypes.oneOf(['rest', 'recovery', 'consistency', 'variety', 'distance', 'intensity', 'easyPaceTooFast', 'paceInconsistent', 'maintain']).isRequired,
    message: PropTypes.string.isRequired,
    priority: PropTypes.string,
    details: PropTypes.object
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default FeedbackCard;
