import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { FileService } from "../file.service";
import { rm } from "node:fs/promises";
import * as path from "node:path";
import { write } from "bun";

const FIXTURES = `${import.meta.dir}/fixtures`;

describe("fileservice.getfiles", () => {
  const dir = `${FIXTURES}/getfiles`;

  beforeAll(async () => {
    await write(`${dir}/a.testfile`, "");
    await write(`${dir}/nested/b.testfile`, "");
  });

  afterAll(async () => {
    rm(dir, { recursive: true });
  });

  test("returns file paths relative to the given directory", async () => {
    const fileService = new FileService(dir, ["testfile"]);
    const files = await fileService.getFiles();

    expect(files).toContain("a.testfile");
    expect(files).toContain(path.join("nested", "b.testfile"));
  });
});

describe("fileservice.getfilerefs", () => {
  const dir = `${FIXTURES}/getfilerefs`;

  beforeAll(async () => {
    await write(`${dir}/video.mp4`, "");
    await write(`${dir}/nested/clip.mp4`, "");
  });

  afterAll(async () => {
    rm(dir, { recursive: true });
  });

  test("returns id and filename without filepath", async () => {
    const fileService = new FileService(dir, ["mp4"]);
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
    const fileService = new FileService(dir, ["mp4"]);
    const first = await fileService.getFileRefs();
    await fileService.populateCache();
    const second = await fileService.getFileRefs();

    expect(first.map((r) => r.id)).toEqual(second.map((r) => r.id));
  });
});
