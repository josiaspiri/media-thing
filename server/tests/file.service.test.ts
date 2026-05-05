import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { FileService } from "../file.service";
import { LocalStorageAdapter } from "../storage/local";
import { rm } from "node:fs/promises";
import { write } from "bun";

const TEST_DIR = `${import.meta.dir}/fixtures`;

describe("fileservice.getfilerefs", () => {
  beforeAll(async () => {
    await write(`${TEST_DIR}/video.mp4`, "");
    await write(`${TEST_DIR}/nested/clip.mp4`, "");
  });

  afterAll(async () => {
    rm(TEST_DIR, { recursive: true });
  });

  test("returns id and filename without filepath", async () => {
    const fileService = new FileService(new LocalStorageAdapter(), TEST_DIR, [
      "mp4",
    ]);
    const refs = await fileService.getFileRefs();

    expect(refs).toHaveLength(2);
    for (const ref of refs) {
      expect(ref).toHaveProperty("id");
      expect(ref).toHaveProperty("filename");
      expect(ref).not.toHaveProperty("filepath");
    }

    expect(refs.map((r) => r.filename)).toContain("video.mp4");
    expect(refs.map((r) => r.filename)).toContain("clip.mp4");
  });

  test("id generation is deterministic", async () => {
    const fileService = new FileService(new LocalStorageAdapter(), TEST_DIR, [
      "mp4",
    ]);
    const first = await fileService.getFileRefs();
    await fileService.populateCache();
    const second = await fileService.getFileRefs();

    expect(first.map((r) => r.id)).toEqual(second.map((r) => r.id));
  });
});
