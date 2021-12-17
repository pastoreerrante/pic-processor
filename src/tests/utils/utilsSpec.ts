import * as path from 'path';
import { openPhoto, findPhotoInCache, listPhotos } from '../../utils/util';

describe('test utilities to handle photos', () => {
  const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');

  it('should list available files inside asset/full', async () => {
    const photos = await listPhotos(fullPhotoPath);

    expect(photos).toEqual(jasmine.arrayContaining(['tux.png', 'shells.jpg']));
  });

  it('should find the correct file extension given just the photo file name without its extension', async () => {
    const fullPhotoName = await findPhotoInCache('shells', fullPhotoPath);

    expect(fullPhotoName).toEqual('shells.jpg');
  });

  it('should find the correct file extension given the photo file name with its extension', async () => {
    const fullPhotoName = await findPhotoInCache('shells.jpg', fullPhotoPath);

    expect(fullPhotoName).toEqual('shells.jpg');
  });

  it('should return undefined if findPhotoInCache has been given a ${photoPath} not containing ${filename}', async () => {
    const fullPhotoName = await findPhotoInCache('notExisting', fullPhotoPath);

    expect(fullPhotoName).toBeUndefined();
  });

  describe('openPhoto tests', () => {
    it('openPhoto should return a not-empty buffer given an existing photo', async () => {
      const [photoBuffer] = await openPhoto('shells', fullPhotoPath);
      expect(photoBuffer).toBeDefined();
    });

    it('openPhoto should return the correct photo extension (jpg, png, etc.) given an existing photo', async () => {
      const [, extension] = await openPhoto('shells', fullPhotoPath);
      expect(extension).toBe('.jpg');
    });

    it('openPhoto should throw a specific not-found error if the given ${filename} is not found inside ${photoPath}', async () => {
      const filename = 'notExistingPhoto';
      await expectAsync(
        openPhoto('notExistingPhoto', fullPhotoPath)
      ).toBeRejectedWith(
        new Error(
          `Unable to find a photo called ${filename} in ${fullPhotoPath}`
        )
      );
    });
  });
});
