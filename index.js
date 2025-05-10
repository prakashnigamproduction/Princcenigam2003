const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/download', (req, res) => {
  const videoURL = req.query.videoURL;
  if (!videoURL) {
    return res.status(400).send('Error: videoURL query parameter is required.');
  }

  const ytdlp = spawn('yt-dlp', ['-f', 'best', '-o', '-', videoURL], {
    env: { ...process.env, YTDL_NO_UPDATE: '1' }
  });

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  res.header('Content-Type', 'video/mp4');

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('error', (err) => {
    console.error('yt-dlp error:', err);
    res.status(500).send('Error processing the download.');
  });

  ytdlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Downloader API</h1>
    <p>Use <code>/download?videoURL=VIDEO_URL</code> to download a video.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
