import { formsConstants } from '../constants';

export const newPhotoMetadata = (metadataFields) => ({
  type: formsConstants.NEW_PHOTO_METADATA,
  metadataFields,
});
