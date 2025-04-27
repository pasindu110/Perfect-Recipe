import { Container, Typography, Box, Paper } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }} className="bg-white shadow-lg rounded-lg">
          <Typography variant="h4" component="h1" gutterBottom className="text-blue-600 font-bold">
            Welcome to Full Stack Application
          </Typography>
          <Typography variant="body1" paragraph className="text-gray-700">
            This is a full-stack application built with Spring Boot and React.
            The backend is powered by Spring Boot, and the frontend is built with React, Material-UI, and Tailwind CSS.
          </Typography>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800 font-medium">Features:</p>
            <ul className="list-disc pl-5 mt-2 text-blue-700">
              <li>Spring Boot Backend</li>
              <li>React Frontend</li>
              <li>Material-UI Components</li>
              <li>Tailwind CSS Styling</li>
              <li>H2 Database</li>
            </ul>
          </div>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 