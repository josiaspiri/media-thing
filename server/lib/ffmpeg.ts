import { DEFAULTS } from "../config";
import { getVideoDuration } from "./ffprobe";

const { SEGMENT_DURATION } = DEFAULTS;

const generatePlaylistSegments = async (filepath: string) => {
  const duration = await getVideoDuration(filepath);
  const count = Math.ceil(duration / SEGMENT_DURATION);

  return Array.from({ length: count }, (_, i) => {
    const remainder = duration - i * SEGMENT_DURATION;
    return `#EXTINF:${Math.min(remainder, SEGMENT_DURATION).toFixed(6)},\n${
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
