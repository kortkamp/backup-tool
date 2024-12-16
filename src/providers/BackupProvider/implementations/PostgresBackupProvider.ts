import 'dotenv/config';
import IBackupProvider from "../models/IBackupProvider";
import { resolve } from 'path';


import { exec } from 'child_process'
import { configs } from '../../../config/upload';
import { logger } from '../../../utils/logger';

class PostgresBackupProvider implements IBackupProvider {

  private connectionUrl: string;

  constructor(){
    const connectionString = process.env.DATABASE_URL;

    if(!connectionString) {
      logger.error('DATABASE_URL is missing in env');
      process.exit()
    }
    this.connectionUrl = process.env.DATABASE_URL
  }

  async backup(): Promise<string> {

    const date = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)

    const {upload: {tmpFolder,filePrefix}} = configs();

    const fileName = `${filePrefix}_${date}.tar`;

    const backupFile = resolve(tmpFolder, fileName);


    return new Promise((resolve, reject) => {
      exec(`pg_dump --dbname=${this.connectionUrl}  -f  ${backupFile} -F t`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
      
        if (stderr) {
          reject(stderr)
        }

        resolve(fileName);
      });
    })
  }

  async restore(fileName: string): Promise<void> {
    throw new Error("Method not implemented.");

    //pg_restore -cC -d t25_dev bootstrap.tar
    //https://soshace.com/2020/11/20/automated-postgresql-backups-with-nodejs-and-bash/
  }

}

export default PostgresBackupProvider