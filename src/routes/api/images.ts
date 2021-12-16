import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import sharp from 'sharp';
import { openPhoto, findPhotoInCache } from '../../utils/util';

const images = express.Router();

const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');

const resizeAndSavePhoto = async (
  photoBuffer: Buffer,
  width: number,
  height: number,
  photoName: string
): Promise<void> => {
  // load the photo into sharp library
  const image = sharp(photoBuffer);
  // do the actual resize
  const resized = image.resize({ width: +width, height: +height });
  // save the resized to file
  await resized.toFile(path.join(thumbPhotoPath, `${photoName}`));
};

images.get('/', async (req: Request, res: Response): Promise<void> => {
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
      await resizeAndSavePhoto(
        photoBuffer,
        width,
        height,
        `${resizedPicName}${extension}`
      );
      res.sendFile(`${resizedPicName}${extension}`, { root: thumbPhotoPath });
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) errorMessage = error.message;
      errorMessage?.includes('Unable to find a photo')
        ? res.status(404)
        : res.status(500);
      res.render('index', { message: errorMessage });
    }
  }
});

export { images as default, resizeAndSavePhoto };
