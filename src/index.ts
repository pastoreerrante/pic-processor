import express from 'express';
import sharp from 'sharp';

const app = express();
const port = 3000;

app.get('/api/images', async (req, res) => {
  const filename = req.query.filename as unknown as string;
  const width = req.query.width as unknown as number;
  const height = req.query.height as unknown as number;

  sharp(`full/${filename}.jpg`)
    .resize({
      width: +width,
      height: +height
    })
    .toBuffer()
    .then((data) => {
      res.send(data);
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`server started at localhost:${port}`);
});
