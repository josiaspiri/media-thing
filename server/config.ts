import path from "node:path";

const getCWD = (isExecutable: boolean) =>
  isExecutable ? path.dirname(process.execPath) : process.cwd();

export const IS_EXECUTABLE = process.argv0 !== "bun";
export const CWD = getCWD(IS_EXECUTABLE);

export const RELATIVE_MEDIA_DIRECTORY = "media";
export const RELATIVE_SCRATCH_DIRECTORY = "media/scratch";

export const DEFAULTS = {
  MEDIA_DIRECTORY: path.resolve(CWD, RELATIVE_MEDIA_DIRECTORY),
  SCRATCH_DIRECTORY: path.resolve(
    CWD,
    RELATIVE_SCRATCH_DIRECTORY,
  ),
  SUPPORTED_FORMATS: ["mp4", "webm", "mkv"],
  MAX_CHUNK: 8 * 1024 * 1024,
  SEGMENT_DURATION: 6,
} as const;
