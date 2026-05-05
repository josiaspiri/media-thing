export const DEFAULTS = {
  MEDIA_DIRECTORY: "media",
  SCRATCH_DIRECTORY: "media/scratch",
  SUPPORTED_FORMATS: ["mp4", "webm", "mkv"],
  MAX_CHUNK: 8 * 1024 * 1024,
  SEGMENT_DURATION: 6,
} as const;
