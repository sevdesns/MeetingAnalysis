import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Toplantı Analiz Platformu
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Ana Sayfa
          </Button>
          <Button color="inherit" component={RouterLink} to="/analysis">
            Analiz
          </Button>
          <Button color="inherit" component={RouterLink} to="/reports">
            Raporlar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 