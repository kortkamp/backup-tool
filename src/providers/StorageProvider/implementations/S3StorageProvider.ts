import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import { resolve } from 'path';

import { IDeleteFileDTO } from '../dtos/IDeleteFileDTO';
import { ISaveFileDTO } from '../dtos/ISaveFileDTO';
import IStorageProvider from '../models/IStorageProvider';
import { configs } from '../../../config/upload';
import { logger } from '../../../utils/logger';

class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({ region: process.env.AWS_S3_REGION });
  }

  public async saveFile({ tmpFile, type }: ISaveFileDTO): Promise<string> {
    const {upload} = configs()

    const originalPath = resolve(upload.tmpFolder, tmpFile);

    const fileContent = await fs.promises.readFile(originalPath);

    const bucket = process.env.AWS_S3_BUCKET;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: tmpFile,
          ACL: 'private',
          Body: fileContent,
        }),
      );
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }

    logger.debug('file uploaded successfully');

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
      logger.error(error);
      throw new Error(error);
    }
  }
}

export default S3StorageProvider;
