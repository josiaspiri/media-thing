import * as path from "node:path";
import { createHash } from "node:crypto";
import { DEFAULTS } from "./config";
import { isSubdir, MEDIA_DIR, SCRATCH_DIR } from "./lib/paths";
import { watch } from "node:fs/promises";
import { getVideoDuration } from "./lib/ffprobe";

type FileInfo = { filename: string; filepath: string; duration?: number };

export class FileService {
  constructor(
    private readonly directory: string,
    private readonly formats: readonly string[],
    private readonly useFsWatcher: boolean = true,
  ) {
    if (this.useFsWatcher) {
      this.setupWatcher();
    }
  }

  private async setupWatcher() {
    const watcher = watch(this.directory, {
      recursive: true,
    });

    for await (const event of watcher) {
      if (!event.filename) continue;

      const filePath = path.join(this.directory, event.filename);
      if (!isSubdir(SCRATCH_DIR, filePath)) continue;

      this.populateCache();
    }
  }

  private cache: Map<
    string,
    FileInfo
  > = new Map();

  private path2id(filepath: string): string {
    return createHash("sha1").update(filepath).digest("hex").slice(0, 12);
  }

  async populateCache() {
    const files = await this.getFiles();
    for (const file of files) {
      const id = this.path2id(file);
      const duration = await getVideoDuration(path.join(this.directory, file))
        .catch(() => undefined);
      this.cache.set(id, {
        filename: path.basename(file),
        filepath: file,
        duration,
      });
    }
  }

  async getFiles(): Promise<string[]> {
    const glob = new Bun.Glob(`**/*.{${this.formats.join(",")}}`);

    return await Array.fromAsync(glob.scan({ cwd: this.directory }));
  }

  async getFileRefs(): Promise<{ id: string; filename: string }[]> {
    if (this.cache.size === 0) await this.populateCache();

    return [...this.cache.entries()].map(([id, { filename, duration }]) => ({
      id,
      filename,
      duration,
    }));
  }

  getByRef(ref: string): FileInfo | undefined {
    const fileInfo = this.cache.get(ref);
    if (!fileInfo) return undefined;

    return this.cache.get(ref);
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

export const fileService = new FileService(
  MEDIA_DIR,
  DEFAULTS.SUPPORTED_FORMATS,
);
