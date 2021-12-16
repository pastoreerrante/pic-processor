import * as path from 'path';
import sharp from 'sharp';
import { openPhoto } from '../../../utils/util';
import { resizeAndSavePhoto } from '../../../routes/api/images';

describe('test actual photo resize', () => {
  const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
  const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');
  const filename = 'tux';
  // random values
  const width = 122;
  const height = 237;
  const resizedPicName = `${filename}_W${width}_H${height}`;

  it('should resize the given photoBuffer and save the resized image inside asset/thumb with the correct dimensions', async () => {
    // open the photo and find its extension
    const [photoBuffer, extension] = await openPhoto(filename, fullPhotoPath);
    // resize and save
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
