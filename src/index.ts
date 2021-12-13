import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import sharp from 'sharp';

import { openPhoto, findPhotoInCache } from './utils/util';

const app = express();
const port = 3000;
const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');

app.set('view engine', 'ejs');

app.get('/api/images', async (req: Request, res: Response) => {
  const filename = req.query.filename as unknown as string;
  const width = req.query.width as unknown as number;
  const height = req.query.height as unknown as number;
  const resizedPicName = `${filename}_W${width}_H${height}`;

  const photo = await findPhotoInCache(resizedPicName, thumbPhotoPath);
  if (photo) {
    res.sendFile(photo, { root: thumbPhotoPath });
  } else {
    try {
      const [photoBuffer, extension] = await openPhoto(filename, fullPhotoPath);
      const image = sharp(photoBuffer);
      const resized = image.resize({ width: +width, height: +height });
      await resized.toFile(
        path.join(thumbPhotoPath, `${resizedPicName}${extension}`)
      );
      res.sendFile(`${resizedPicName}${extension}`, { root: thumbPhotoPath });
    } catch (err) {
      console.log(err);
      res.status(404);
      res.render('index');
    }
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`server started at localhost:${port}`);
});

export default app;
