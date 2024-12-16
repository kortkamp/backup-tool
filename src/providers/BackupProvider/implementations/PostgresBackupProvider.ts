import 'dotenv/config';
import IBackupProvider from "../models/IBackupProvider";
import { resolve } from 'path';


import { exec } from 'child_process'
import { configs } from '../../../config/upload';

class PostgresBackupProvider implements IBackupProvider {

  private connectionUrl: string;

  constructor(){
    const connectionString = process.env.DATABASE_URL;

    if(!connectionString) {
      throw new Error('DATABASE_URL is missing in env')
    }
    this.connectionUrl = process.env.DATABASE_URL
  }

  async backup(): Promise<string> {

    const date = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)

    const {upload: {tmpFolder,filePrefix}} = configs();

    const backupFile = resolve(tmpFolder, `${filePrefix}_${date}.tar`);


    return new Promise((resolve, reject) => {
      exec(`pg_dump --dbname=${this.connectionUrl}  -f  ${backupFile} -F t`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
      
        if (stderr) {
          reject(stderr)
        }

        resolve(stdout);
      });
    })
  }

  async restore(fileName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}

export default PostgresBackupProvider