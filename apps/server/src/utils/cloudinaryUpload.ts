import { cloudinary } from './cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

const cloudinaryUpload = async (files: Array<File>) => {
  const filesArray = files.map((file: any) => {
    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const filename = file.originalname.slice(
      0,
      file.originalname.lastIndexOf('.')
    );

    return cloudinary.uploader.upload(dataUri, {
      public_id: `${filename}-${uuidv4()}`,
      folder: 'synapse',
      resource_type: 'image',
    });
  });

  return Promise.all(filesArray);
};

export { cloudinaryUpload };
