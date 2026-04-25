import type { StorageAdapter } from "./interface";
import * as path from "node:path";

export class LocalStorageAdapter implements StorageAdapter {
  async list(
    directory: string,
    extensions: readonly string[],
  ): Promise<string[]> {
    const dir = path.resolve(directory);
    const glob = new Bun.Glob(`**/*.{${extensions.join(",")}}`);

    return await Array.fromAsync(glob.scan({ cwd: dir }));
  }
}
