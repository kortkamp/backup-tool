import {configs} from "./config/upload";
import PostgresBackupProvider from "./providers/BackupProvider/implementations/PostgresBackupProvider"
import { SesNotificationsProvider } from "./providers/NotificationsProvider/implementations/SesNotificationsProvider";
import S3StorageProvider from "./providers/StorageProvider/implementations/S3StorageProvider";
import fs from 'fs';
import { resolve } from 'path';
import { logger } from "./utils/logger";

logger.debug('starting backup tool...');

const backupProvider = new PostgresBackupProvider();

const storageProvider = new S3StorageProvider();

const notificationsProvider = new SesNotificationsProvider();

const run = async () => {

  const fileName = await backupProvider.backup();

  await storageProvider.saveFile({tmpFile: fileName, type: ''});
  
  logger.debug('file created ', fileName)

  const originalPath = resolve(configs().upload.tmpFolder, fileName);
  
  await fs.promises.unlink(originalPath);

  logger.debug('Success')
}

run().then(() => {
  if(process.env.NOTIFY_SUCCESS){
    notificationsProvider.sendNotification({
      message: `Backup successfully for ${process.env.APP_NAME}.`  
    })
    logger.debug('Success notification sent.')
  }
}).catch((error) => {
  logger.error(error);
  notificationsProvider.sendNotification({
       message: `Backup failed for ${process.env.APP_NAME}. Error: ${error.message}`  
  })
  logger.debug('Failure notification sent!')
});

