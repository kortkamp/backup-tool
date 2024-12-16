import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import { resolve } from 'path';
import mime from 'mime';


// import { logger } from '@shared/utils/logger';

import { IDeleteFileDTO } from '../dtos/IDeleteFileDTO';
import { ISaveFileDTO } from '../dtos/ISaveFileDTO';
import IStorageProvider from '../models/IStorageProvider';
import { configs } from '../../../config/upload';

class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({ region: process.env.AWS_S3_REGION });
  }

  public async saveFile({ tmpFile, type }: ISaveFileDTO): Promise<string> {
    const {upload} = configs()

    const originalPath = resolve(upload.tmpFolder, tmpFile);

    const fileContent = await fs.promises.readFile(originalPath);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('S3_Service: File not found ');
    }

    const bucket = upload.containerName;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: tmpFile,
          ACL: 'private',
          Body: fileContent,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      // logger.error(error);
      throw new Error(error);
    }

    await fs.promises.unlink(originalPath);

    return tmpFile;
  }

  public async deleteFile({ file, type }: IDeleteFileDTO): Promise<void> {
    const { upload } = configs()

    const bucket = upload.containerName;

    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: file }),
      );
    } catch (error) {
      // logger.error(error);
      throw new Error(error);
    }
  }
}

export default S3StorageProvider;
