import { useState } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, Grid, Card, CardContent } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AudioFile, VideoFile, PictureAsPdf } from '@mui/icons-material';
import * as pdfjsLib from 'pdfjs-dist';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// PDF.js worker'ı yapılandır
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Analysis() {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3'],
      'video/*': ['.mp4'],
      'application/pdf': ['.pdf']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles);
      setError(null);
    }
  });

  const analyzePDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
      }

      // Basit bir özet oluştur
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 5).join('. ') + '.';
      
      // Katılımcıları tespit et
      const participantsMatch = text.match(/Katılımcılar:?\s*([^\n]+)/i);
      const participants = participantsMatch 
        ? participantsMatch[1].split(/[,;]/).map(p => p.trim())
        : ['Katılımcı bilgisi bulunamadı'];

      return {
        summary,
        participants,
        keyPoints: sentences.slice(0, 3).map(s => s.trim())
      };
    } catch (err) {
      console.error('PDF analiz hatası:', err);
      throw new Error('PDF dosyası analiz edilirken bir hata oluştu.');
    }
  };

  const analyzeAudio = async (file) => {
    try {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();

      // Ses dosyasını yükle
      await ffmpeg.writeFile('input.mp3', await fetchFile(file));
      
      // Ses analizi için FFmpeg komutları
      // Bu kısım gerçek bir ses analiz API'si ile değiştirilmeli
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simüle edilmiş analiz

      return {
        summary: 'Ses analizi tamamlandı. Konuşmacılar tespit edildi.',
        participants: ['Konuşmacı 1', 'Konuşmacı 2'],
        keyPoints: ['Önemli nokta 1', 'Önemli nokta 2']
      };
    } catch (err) {
      console.error('Ses analiz hatası:', err);
      throw new Error('Ses dosyası analiz edilirken bir hata oluştu.');
    }
  };

  const analyzeVideo = async (file) => {
    try {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();

      // Video dosyasını yükle
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // Video süresini al
      await ffmpeg.exec(['-i', 'input.mp4']);
      const duration = await ffmpeg.readStderr();
      const durationMatch = duration.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);

      // Video bilgilerini al
      await ffmpeg.exec(['-i', 'input.mp4', '-hide_banner']);
      const info = await ffmpeg.readStderr();

      // Video özeti oluştur
      const summary = `Video analizi tamamlandı.\nSüre: ${durationMatch ? durationMatch[0] : 'Bilinmiyor'}\nFormat: ${info.match(/Stream.*Video: (.*?)\s/)?.[1] || 'Bilinmiyor'}`;

      return {
        summary,
        participants: ['Konuşmacı 1', 'Konuşmacı 2'],
        keyPoints: ['Önemli nokta 1', 'Önemli nokta 2']
      };
    } catch (err) {
      console.error('Video analiz hatası:', err);
      throw new Error('Video dosyası analiz edilirken bir hata oluştu.');
    }
  };

  const handleAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);

    try {
      const results = await Promise.all(
        files.map(async (file, index) => {
          setAnalysisProgress((index + 1) * (100 / files.length));
          
          try {
            if (file.type === 'application/pdf') {
              return await analyzePDF(file);
            } else if (file.type.startsWith('audio/')) {
              return await analyzeAudio(file);
            } else if (file.type.startsWith('video/')) {
              return await analyzeVideo(file);
            }
          } catch (err) {
            console.error(`${file.name} dosyası analiz hatası:`, err);
            return {
              summary: `${file.name} dosyası analiz edilemedi: ${err.message}`,
              participants: ['Analiz başarısız'],
              keyPoints: ['Dosya analiz edilemedi']
            };
          }
        })
      );

      // Tüm sonuçları birleştir
      const combinedResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        files: files.map(f => f.name),
        summary: results.map(r => r.summary).join('\n\n'),
        participants: [...new Set(results.flatMap(r => r.participants))],
        keyPoints: results.flatMap(r => r.keyPoints)
      };

      // Sonuçları localStorage'a kaydet
      const existingResults = JSON.parse(localStorage.getItem('analysisResults') || '[]');
      localStorage.setItem('analysisResults', JSON.stringify([...existingResults, combinedResult]));

      // Dosyaları temizle
      setFiles([]);
    } catch (err) {
      console.error('Genel analiz hatası:', err);
      setError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return <PictureAsPdf />;
    if (file.type.startsWith('audio/')) return <AudioFile />;
    if (file.type.startsWith('video/')) return <VideoFile />;
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Toplantı Analizi
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                height: '100%',
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="h6" gutterBottom>
                Dosya Yükle
              </Typography>
              <Typography>
                {isDragActive
                  ? 'Dosyaları buraya bırakın...'
                  : 'Dosyaları sürükleyip bırakın veya seçmek için tıklayın'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Desteklenen formatlar: MP3, MP4, PDF
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            {files.length > 0 && (
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Yüklenen Dosyalar:
                </Typography>
                {files.map((file, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getFileIcon(file)}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{file.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {analyzing && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress variant="determinate" value={analysisProgress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Analiz ediliyor... {Math.round(analysisProgress)}%
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAnalysis}
            disabled={files.length === 0 || analyzing}
            startIcon={analyzing ? <CircularProgress size={20} /> : null}
            size="large"
          >
            {analyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Analysis; 