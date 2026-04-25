import * as path from "node:path";
import type { StorageAdapter } from "./storage/interface";

export class FileService {
  constructor(
    private readonly storage: StorageAdapter,
    private readonly directory: string,
    private readonly formats: readonly string[],
  ) {}

  async getFiles(): Promise<string[]> {
    return await this.storage.list(this.directory, this.formats);
  }

  async getDirectories(): Promise<string[]> {
    const filepaths = await this.getFiles();
    const dirs = new Set<string>();

    for (const filepath of filepaths) {
      dirs.add(path.dirname(filepath));
    }

    return [...dirs];
  }
}
