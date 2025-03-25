import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Toplantı Analiz Platformuna Hoş Geldiniz
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Toplantılarınızı analiz edin, içgörüler elde edin
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 4, mt: 4 }}>
        <Paper
          sx={{
            p: 3,
            cursor: 'pointer',
            '&:hover': { boxShadow: 6 },
          }}
          onClick={() => navigate('/analysis')}
        >
          <Typography variant="h5" gutterBottom>
            Yeni Analiz
          </Typography>
          <Typography>
            Toplantı kayıtlarınızı yükleyin ve detaylı analiz raporları alın.
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 3,
            cursor: 'pointer',
            '&:hover': { boxShadow: 6 },
          }}
          onClick={() => navigate('/reports')}
        >
          <Typography variant="h5" gutterBottom>
            Raporlarım
          </Typography>
          <Typography>
            Geçmiş analiz raporlarınızı görüntüleyin ve karşılaştırın.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 