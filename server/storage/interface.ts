export interface StorageAdapter {
  list(directory: string, extensions: readonly string[]): Promise<string[]>;
}
