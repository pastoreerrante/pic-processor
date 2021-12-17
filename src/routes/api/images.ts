import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import sharp from 'sharp';
import { openPhoto, findPhotoInCache } from '../../utils/util';

const images = express.Router();

// path containing original photos. process.cwd() gives back
// the project root path
const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
// path containing resized photos
const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');

// this is the heart of pic-processor. It takes a photoBuffer,
// resize it according to width and height and then save it to
// thumbPhotoPath
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
  // retrieve parameters from query string
  const filename = req.query.filename as unknown as string;
  const width = req.query.width as unknown as number;
  const height = req.query.height as unknown as number;
  const resizedPicName = `${filename}_W${width}_H${height}`;

  // first, let's check if phot is already inside cache
  const photo = await findPhotoInCache(resizedPicName, thumbPhotoPath);
  if (photo) {
    res.sendFile(photo, { root: thumbPhotoPath });
  } else {
    try {
      // if not in cache, open the photo (if present) and find its extension (.jpg, .png, etc.)
      const [photoBuffer, extension] = await openPhoto(filename, fullPhotoPath);
      // resize and save it to thumbPhotoPath
      await resizeAndSavePhoto(
        photoBuffer,
        width,
        height,
        `${resizedPicName}${extension}`
      );
      res.sendFile(`${resizedPicName}${extension}`, { root: thumbPhotoPath });
    } catch (error) {
      let errorMessage;
      // extract the error string in a type safe-way
      if (error instanceof Error) errorMessage = error.message;
      errorMessage?.includes('Unable to find a photo')
        ? res.status(404)  // not found photo
        : res.status(500); // error processing photo (e.g. width/height missing)
      res.render('index', { message: errorMessage });
    }
  }
});

export { images as default, resizeAndSavePhoto };
