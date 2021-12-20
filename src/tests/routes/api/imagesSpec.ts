import * as path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { openPhoto, listPhotos, resizeAndSavePhoto } from '../../../utils/util';
import { fullPhotoPath, thumbPhotoPath } from '../../../index';

describe('test actual photo resize', () => {
  // remove any existing resized photo before running test
  beforeAll(async () => {
    const photos = await listPhotos(thumbPhotoPath);
    for (const photo of photos) {
      await fs.unlink(path.join(thumbPhotoPath, photo));
    }
  });

  // random resize values
  const width = 122;
  const height = 237;
  const filename = 'tux';
  const resizedPicName = `${filename}_W${width}_H${height}`;

  it('should resize the given photoBuffer and save the resized image inside asset/thumb with the correct dimensions', async () => {
    // open the photo and find its extension
    const [photoBuffer, extension] = await openPhoto(filename, fullPhotoPath);
    // resize and save <--- we are testing this step
    await resizeAndSavePhoto(
      photoBuffer,
      width,
      height,
      `${resizedPicName}${extension}`
    );
    // open the resized photo
    const resized = sharp(
      path.join(thumbPhotoPath, `${resizedPicName}${extension}`)
    );
    // retrieve metadata from the resized photo
    const { width: resizedWidth, height: resizedHeight } =
      await resized.metadata();

    expect(resizedWidth === width && resizedHeight === height).toBeTrue;
  });
});
