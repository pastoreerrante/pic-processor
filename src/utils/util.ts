import * as path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { thumbPhotoPath } from '../index';

// list photos inside the given photoPath and return a list of photo names
const listPhotos = async (photoPath: string): Promise<string[]> => {
  const photos = await fs.readdir(photoPath);
  return photos;
};

// this function, once exported, is called findPhotoInCache().
// This is because it can be used not only to find a photo extension
// string but also as a way to check if a photo is present in a given path
// that can be used as a cache
const findPhotoExtension = async (
  filename: string,
  photoPath: string
): Promise<string> => {
  // assuming a file named 'dog.jpg' is inside ${photoPath},
  // availablePhotos will contain all files in  ${photoPath},
  // e.g. [ 'dog.jpg', 'cat.png' ]
  const availablePhotos = await listPhotos(photoPath);
  // if filename is 'dog', photos should be just a list like ['dog.jpg']
  // if filename is 'dog.jpg', we trim the extension and then compare just names
  const photoName = path.parse(filename).name;
  const photos = availablePhotos.filter(
    (photo) => path.parse(photo).name === photoName
  );
  // we assume there is just one photo with a given name, i.e. if there are dog.jpg and
  // dog.png inside full path only the first one will be found and processed.
  return photos[0];
};

// open the photo and return a list including its content (a Buffer) and its filename
const openPhoto = async (
  filename: string,
  photoPath: string
): Promise<[Buffer, string]> => {
  // ${filename} is end-user input and typically lacks photo extension;
  // findPhotoExtension() looks in the given ${photoPath}, list files and try to
  // to find ${filename} among them.
  // If found, return photo file name + extension, else undefined
  const photo = await findPhotoExtension(filename, photoPath);
  if (!photo) {
    throw new Error(
      `Unable to find a photo called ${filename} in ${photoPath}`
    );
  }
  const openFile = await fs.readFile(path.join(photoPath, photo));
  // we need to give back to the caller the photo extension,
  // since photo extension can be not known at the caller site
  const photoExtension = path.parse(photo).ext;
  return [openFile, photoExtension];
};

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

export {
  openPhoto,
  findPhotoExtension as findPhotoInCache,
  listPhotos,
  resizeAndSavePhoto
};
