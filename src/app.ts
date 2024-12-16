import PostgresBackupProvider from "./providers/BackupProvider/implementations/PostgresBackupProvider"

console.log('starting backup tool')

const backupProvider = new PostgresBackupProvider();

const run = async () => {
  const result = await backupProvider.backup();
  console.log(result)
  console.log('finish')
}

run();

