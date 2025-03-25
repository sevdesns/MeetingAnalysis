import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Reports from './pages/Reports';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
