import * as path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { openPhoto, listPhotos } from '../../../utils/util';
import { resizeAndSavePhoto } from '../../../routes/api/images';

describe('test actual photo resize', () => {
  const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
  const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');
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
  const resizedPicName = `${filename}_W${width}_H${height}`;
  const filename = 'tux';

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
