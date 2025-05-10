const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
  const videoURL = req.query.videoURL;
  if (!videoURL) {
    return res.status(400).send('Error: videoURL query parameter is required.');
  }

  try {
    // वीडियो की जानकारी प्राप्त करें
    const info = await ytdl.getInfo(videoURL);
    // वीडियो का title निकालें और filename-friendly format में बदलें
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
    // वीडियो स्ट्रीम को response pipe करें
    ytdl(videoURL, { quality: 'highestvideo' }).pipe(res);
  } catch (error) {
    console.error('Error in /download:', error);
    res.status(500).send('Error processing your request.');
  }
});

// बेस रूट पर welcome message
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the YouTube Downloader API!</h1>
    <p>Use the endpoint <code>/download?videoURL=YOUTUBE_VIDEO_URL</code> to download a video.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
