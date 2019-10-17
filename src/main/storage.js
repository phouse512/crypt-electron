/* helps store data locally */
import fs from 'fs';
import { app } from 'electron';

import storageConstants from '../constants/storage';


/*
 * check if an image exists, given its id.
 */
export const imageExists = (imageId) => {
  const encPhotoPath = getImagePath(imageId);
  if (fs.existsSync(encPhotoPath)) {
    return true;
  }
  return false;
};

/*
 * get an image path 
 */
export const getImagePath = (imageId) => {
  return `${app.getPath('userData')}/${storageConstants.ENC_PHOTO_DIR}/${imageId}`;
}

export const storeUnencImage = (imageBuffer, imageId) => {
  const path = `${app.getPath('userData')}/${storageConstants.UNENC_PHOTO_DIR}/${imageId}`;
  fs.writeFileSync(path, imageBuffer);
  return path;
};

export const storeEncImage = (imageBuffer, imageId) => {
  const path = getImagePath(imageId);
  fs.writeFileSync(path, imageBuffer);
  return path;
};
