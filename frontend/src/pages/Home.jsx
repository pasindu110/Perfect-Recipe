import { Container, Typography, Box, Paper } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Full Stack Application
          </Typography>
          <Typography variant="body1" paragraph>
            This is a full-stack application built with Spring Boot and React.
            The backend is powered by Spring Boot, and the frontend is built with React and Material-UI.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 