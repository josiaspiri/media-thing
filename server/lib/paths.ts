import * as path from "node:path";
import { DEFAULTS } from "../config";

const IS_EXECUTABLE = process.argv0 !== "bun";
const CWD = IS_EXECUTABLE ? path.dirname(process.execPath) : process.cwd();

export const MEDIA_DIR = path.resolve(CWD, DEFAULTS.MEDIA_DIRECTORY);
export const SCRATCH_DIR = path.resolve(CWD, DEFAULTS.SCRATCH_DIRECTORY);

export const mediaPath = (...segments: string[]) =>
  path.join(MEDIA_DIR, ...segments);

export const scratchSegmentPath = (videoRef: string, segmentIndex: number) =>
  path.join(
    SCRATCH_DIR,
    videoRef,
    `${String(segmentIndex).padStart(4, "0")}.ts`,
  );

export const isSubdir = (parent: string, child: string) => {
  const relative = path.relative(
    path.resolve(parent),
    path.resolve(child),
  );

  return !relative.startsWith("..") && !path.isAbsolute(relative);
};
