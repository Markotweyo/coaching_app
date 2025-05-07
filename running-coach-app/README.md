# Running Coach Application

A full-stack application for tracking and analyzing running activities, providing personalized feedback and recommendations.

## Features

- Track running activities with detailed metrics
- View running history and statistics
- Get personalized running recommendations
- Analyze pace and performance
- Monitor weekly progress
- Track recovery and training load

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- RESTful API

### Frontend
- React
- Material-UI
- Chart.js for visualizations
- Axios for API calls

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in backend directory:
     ```
     MONGODB_URI=mongodb://localhost:27017/running-coach
     PORT=3000
     ```
   - Create `.env` file in frontend directory:
     ```
     REACT_APP_API_URL=http://localhost:3000/api
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## API Endpoints

### Runs
- GET `/api/runs/:userId` - Get all runs for a user
- POST `/api/runs` - Add a new run
- PATCH `/api/runs/:id` - Update a run
- DELETE `/api/runs/:id` - Delete a run
- GET `/api/runs/:userId/weekly/:year/:week` - Get weekly stats

### Feedback
- GET `/api/feedback/recommendations/:userId` - Get running recommendations
- GET `/api/feedback/pace-analysis/:userId` - Get pace analysis

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
