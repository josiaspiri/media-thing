import { type BunRequest } from "bun";
import { generatePlaylist, transcodeSegment } from "../lib/ffmpeg";
import { fileService } from "../file.service";
import { RESPONSES } from "../lib/responses";
import { DEFAULTS } from "../config";
import { mediaPath } from "../lib/paths";

export const getHlsPlaylist = async (
  req: BunRequest<"/hls-video/:videoRef/index.m3u8">,
) => {
  const videoRef = req.params.videoRef;
  const fileInfo = fileService.getByRef(videoRef);
  const filepath = fileInfo?.filepath;

  if (!filepath) return RESPONSES.NOT_FOUND();

  return new Response(
    await generatePlaylist(mediaPath(filepath)),
  );
};

export const getHlsSegment = async (
  req: BunRequest<"/hls-video/:videoRef/:segment">,
) => {
  const { videoRef, segment } = req.params;
  const segmentMatch = segment.match(/^(\d+)\.ts$/)![1]!;
  const segmentIndex = parseInt(segmentMatch);
  const fileInfo = fileService.getByRef(videoRef);
  if (!fileInfo) return RESPONSES.NOT_FOUND();

  const { filepath, duration } = fileInfo;
  if (!duration) return RESPONSES.NOT_FOUND();

  const outputSegment = await transcodeSegment(
    mediaPath(filepath),
    segmentIndex,
    DEFAULTS.SEGMENT_DURATION,
    duration,
    videoRef,
  );

  return new Response(outputSegment.stream(), {
    headers: { "Content-Type": "video/mp2t" },
  });
};
