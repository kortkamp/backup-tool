export default interface IBackupProvider {
  backup(): Promise<string>;
  restore(fileName: string): Promise<void>;
}