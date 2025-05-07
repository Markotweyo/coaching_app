import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RunHistory from './pages/RunHistory';
import Dashboard from './pages/Dashboard';
import AddRun from './pages/AddRun';
import Feedback from './pages/Feedback';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<RunHistory />} />
          <Route path="/add-run" element={<AddRun />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 