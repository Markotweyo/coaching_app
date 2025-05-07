import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Running Coach
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/history">
            History
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-run">
            Add Run
          </Button>
          <Button color="inherit" component={RouterLink} to="/feedback">
            Feedback
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 