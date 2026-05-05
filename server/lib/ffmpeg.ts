import { DEFAULTS } from "../config";
import { getVideoDuration } from "./ffprobe";
import { scratchSegmentPath } from "./paths";

const { SEGMENT_DURATION } = DEFAULTS;

const generatePlaylistSegments = async (filepath: string) => {
  const duration = await getVideoDuration(filepath);
  const count = Math.ceil(duration / SEGMENT_DURATION);

  return Array.from({ length: count }, (_, i) => {
    const remainder = duration - i * SEGMENT_DURATION;
    return `#EXTINF:${Math.min(remainder, SEGMENT_DURATION).toFixed(3)},\n${
      String(i).padStart(4, "0")
    }.ts`;
  }).join("\n");
};

export const generatePlaylist = async (filepath: string) => {
  const header = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    `#EXT-X-TARGETDURATION:${Math.ceil(SEGMENT_DURATION)}`,
    "#EXT-X-MEDIA-SEQUENCE:0",
  ].join("\n");
  const terminator = "#EXT-X-ENDLIST";

  return [header, await generatePlaylistSegments(filepath), terminator].join(
    "\n",
  );
};

export const transcodeSegment = async (
  filepath: string,
  segmentIndex: number,
  segmentDuration: number,
  fileDuration: number,
  videoRef: string,
) => {
  const start = segmentIndex * segmentDuration;
  const end = Math.min(start + segmentDuration, fileDuration);
  const outFile = scratchSegmentPath(videoRef, segmentIndex);

  if (await Bun.file(outFile).exists()) return Bun.file(outFile);

  const proc = Bun.spawn([
    "ffmpeg",
    "-ss",
    String(start),
    "-i",
    filepath,
    "-to",
    String(end),
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-sn",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "main",
    "-c:a",
    "aac",
    "-ac",
    "2",
    "-b:a",
    "128k",
    "-ar",
    "48000",
    "-copyts",
    "-f",
    "mpegts",
    "-y",
    outFile,
  ], { stderr: "ignore", stdin: "ignore", stdout: "ignore" });
  await proc.exited;
  return Bun.file(outFile);
};
