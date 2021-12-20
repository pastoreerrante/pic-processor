import express from 'express';
import { Request, Response } from 'express';
import { fullPhotoPath, thumbPhotoPath } from '../../index';
import {
  openPhoto,
  findPhotoInCache,
  resizeAndSavePhoto
} from '../../utils/util';

const images = express.Router();

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
        ? res.status(404) // not found photo
        : res.status(500); // error processing photo (e.g. width/height missing)
      res.render('index', { message: errorMessage });
    }
  }
});

export default images;
