const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Route to download YouTube video
app.get('/download', (req, res) => {
  const videoURL = req.query.videoURL;
  if (!videoURL) {
    return res.status(400).send('Error: videoURL query parameter is required.');
  }

  // Prepare yt-dlp arguments
  const args = [
    '--geo-bypass',
    '-f', 'best',
    '-o', '-', // Output to stdout
    videoURL
  ];

  // Check if cookies.txt file exists
  const cookiesPath = path.join(__dirname, 'cookies.txt');
  if (fs.existsSync(cookiesPath)) {
    args.unshift('--cookies', cookiesPath);
  }

  // Spawn yt-dlp process
  const ytdlp = spawn('yt-dlp', args, {
    env: { ...process.env, YTDL_NO_UPDATE: '1' }
  });

  // Set headers
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  res.header('Content-Type', 'video/mp4');

  // Pipe the video stream
  ytdlp.stdout.pipe(res);

  // Handle errors
  ytdlp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('error', (err) => {
    console.error('yt-dlp error:', err);
    res.status(500).send('Download process error.');
  });

  ytdlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Downloader API</h1>
    <p>Use <code>/download?videoURL=YOUTUBE_LINK</code> to download videos from any country.</p>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
