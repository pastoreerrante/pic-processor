import { promises as fs } from 'fs';
import * as path from 'path';

const listPhotos = async (photoPath: string): Promise<string[]> => {
  const photos = await fs.readdir(photoPath);
  return photos;
};

const findPhotoExt = async (
  filename: string,
  photoPath: string
): Promise<string> => {
  // assuming a file named 'dog.jpg' is inside ${photoPath},
  // availablePhotos will contain all files in  ${photoPath},
  // e.g. [ 'dog.jpg', 'cat.png' ]
  const availablePhotos = await listPhotos(photoPath);
  // if filename is 'dog', photos should be just a list like ['dog.jpg']
  const photos = availablePhotos.filter(
    (photo) => path.parse(photo).name === filename
  );
  return photos[0];
};

const openPhoto = async (
  filename: string,
  photoPath: string
): Promise<[Buffer, string]> => {
  console.log(
    `inside openPhoto | filename: ${filename}, photoPath: ${photoPath}`
  );
  // ${filename} is end-user input and typically lacks photo extension;
  // findPhotoExt() looks in the given ${photoPath}, list files and try to
  // to find ${filename} among them.
  // If found, return photo file name + extension, else undefined
  const photo = await findPhotoExt(filename, photoPath);
  console.log(`inside openPhoto | photo: ${photo}`);
  const openFile = await fs.readFile(path.join(photoPath, photo));
  // we need to give back to the caller the photo extension,
  // since photo extension is not known at the caller site
  const photoExtension = path.parse(photo).ext;
  return [openFile, photoExtension];
};

export { openPhoto, findPhotoExt as findPhotoInCache };
