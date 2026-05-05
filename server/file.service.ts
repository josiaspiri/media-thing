import * as path from "node:path";
import { createHash } from "node:crypto";

export class FileService {
  constructor(
    private readonly directory: string,
    private readonly formats: readonly string[],
  ) {}

  private cache: Map<
    string,
    { filename: string; filepath: string }
  > = new Map();

  private path2id(filepath: string): string {
    return createHash("sha1").update(filepath).digest("hex").slice(0, 12);
  }

  async populateCache() {
    const files = await this.getFiles();
    for (const file of files) {
      const id = this.path2id(file);
      this.cache.set(id, {
        filename: path.basename(file),
        filepath: file,
      });
    }
  }

  async getFiles(): Promise<string[]> {
    const dir = path.resolve(this.directory);
    const glob = new Bun.Glob(`**/*.{${this.formats.join(",")}}`);
    return await Array.fromAsync(glob.scan({ cwd: dir }));
  }

  async getFileRefs(): Promise<{ id: string; filename: string }[]> {
    if (this.cache.size === 0) await this.populateCache();
    return [...this.cache.entries()].map(([id, { filename }]) => ({
      id,
      filename,
    }));
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
