import { resolve } from 'path';

interface IUploadReturn {
  upload: {
    tmpFolder: string;
    containerName: string
    filePrefix: string
  }
}

const  configs = (): IUploadReturn => {
  const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

  return {
    upload: {
      tmpFolder,
      containerName: process.env.CONTAINER_NAME,
      filePrefix: process.env.FILE_PREFIX
    }
  };
}

export { configs }
