import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { LocalStorageAdapter } from "../storage/local";
import { rm } from "node:fs/promises";
import * as path from "node:path";
import { write } from "bun";

const TEST_DIR = `${import.meta.dir}/fixtures`;

describe("localstorageadapter.list", () => {
  beforeAll(async () => {
    await write(`${TEST_DIR}/a.testfile`, "");
    await write(`${TEST_DIR}/nested/b.testfile`, "");
  });

  afterAll(async () => {
    rm(TEST_DIR, { recursive: true });
  });

  test("returns file paths relative to the given directory", async () => {
    const adapter = new LocalStorageAdapter();
    const files = await adapter.list(TEST_DIR, ["testfile"]);

    expect(files).toContain("a.testfile");
    expect(files).toContain(path.join("nested", "b.testfile"));
  });
});
