import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, FilePresent as FileIcon } from '@mui/icons-material';

function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('analysisResults') || '[]');
    setReports(savedReports);
  }, []);

  const handleDelete = (id) => {
    const updatedReports = reports.filter(report => report.id !== id);
    localStorage.setItem('analysisResults', JSON.stringify(updatedReports));
    setReports(updatedReports);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'mp3': return 'Ses';
      case 'mp4': return 'Video';
      default: return 'Diğer';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analiz Raporları
        </Typography>

        {reports.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Henüz analiz raporu bulunmamaktadır.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} key={report.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Analiz #{report.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tarih: {formatDate(report.date)}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => handleView(report)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(report.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Analiz Edilen Dosyalar:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {report.files.map((file, index) => (
                          <Chip
                            key={index}
                            icon={<FileIcon />}
                            label={`${file} (${getFileType(file)})`}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Katılımcılar:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {report.participants.map((participant, index) => (
                          <Chip
                            key={index}
                            label={participant}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Önemli Noktalar:
                      </Typography>
                      <List dense>
                        {report.keyPoints.map((point, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={point} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Analiz Raporu #{selectedReport?.id}
          </DialogTitle>
          <DialogContent>
            {selectedReport && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Tarih: {formatDate(selectedReport.date)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Analiz Edilen Dosyalar:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {selectedReport.files.map((file, index) => (
                    <Chip
                      key={index}
                      icon={<FileIcon />}
                      label={`${file} (${getFileType(file)})`}
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Toplantı Özeti:
                </Typography>
                <Typography paragraph>
                  {selectedReport.summary}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Katılımcılar:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {selectedReport.participants.map((participant, index) => (
                    <Chip
                      key={index}
                      label={participant}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Önemli Noktalar:
                </Typography>
                <List>
                  {selectedReport.keyPoints.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Kapat</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Reports; 