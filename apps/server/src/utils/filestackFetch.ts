import axios from 'axios';

const filestackFetch = async (files: Array<File>) => {
  const filesArray = files.map((file: any) => {
    const extname = file.originalname.slice(
      0,
      file.originalname.lastIndexOf('.')
    );
    return axios.post(
      `https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${extname}`,
      file.buffer,
      {
        headers: {
          'Content-Type': file.mimetype,
        },
      }
    );
  });
  return Promise.all(filesArray);
};

export { filestackFetch };
