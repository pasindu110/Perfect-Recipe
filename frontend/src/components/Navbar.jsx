import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-blue-800">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="font-bold">
          Full Stack App
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            className="hover:bg-blue-700 transition-colors duration-300"
          >
            Home
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 