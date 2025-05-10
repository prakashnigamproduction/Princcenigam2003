const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.get('/download', async (req, res) => {
  const url = req.query.url;
  const info = await ytdl.getBasicInfo(url);
  const videoUrl = info.formats[0].url;
  const videoFormat = info.formats[0].format;
  const videoSize = info.formats[0].size;

  res.json({
    videoUrl,
    videoFormat,
    videoSize,
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
