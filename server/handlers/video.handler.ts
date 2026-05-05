import type { BunRequest } from "bun";
import * as path from "node:path";
import { RESPONSES } from "../lib/responses";
import { DEFAULTS } from "../config";
import { FileService } from "../file.service";

const mediaDir = path.resolve(DEFAULTS.MEDIA_DIRECTORY);

const fileService = new FileService(
  DEFAULTS.MEDIA_DIRECTORY,
  DEFAULTS.SUPPORTED_FORMATS,
);

export const getSupportedStream = async (req: BunRequest) => {
  const { pathname } = new URL(req.url);
  const requestPath = pathname.slice("/video/".length);

  const resolved = path.resolve(mediaDir, requestPath);
  if (!resolved.startsWith(mediaDir + path.sep)) {
    return RESPONSES.NOT_FOUND();
  }

  const videoFile = Bun.file(resolved);

  if (!await videoFile.exists()) {
    return RESPONSES.NOT_FOUND();
  }

  const videoFileSize = videoFile.size;

  const range = req.headers.get("range");
  if (!range) {
    return new Response(videoFile, {
      status: 200,
      headers: {
        "Content-Length": `${videoFileSize}`,
        "Content-Type": videoFile.type,
        "Accept-Ranges": "bytes",
      },
    });
  }

  const matches = range.match(/^bytes=(\d+)-(\d*)$/);
  if (!matches) {
    return RESPONSES.UNSATISFIABLE(videoFileSize);
  }

  const start = parseInt(matches[1]!);
  const end = matches[2]
    ? parseInt(matches[2])
    : Math.min(videoFileSize - 1, start + DEFAULTS.MAX_CHUNK - 1);

  if (start > end || end >= videoFileSize) {
    return RESPONSES.UNSATISFIABLE(videoFileSize);
  }

  const chunk = videoFile.slice(start, end + 1);

  return new Response(chunk, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${videoFileSize}`,
      "Content-Length": `${chunk.size}`,
      "Content-Type": videoFile.type,
      "Accept-Ranges": "bytes",
    },
  });
};

export const getVideosApi = async () => {
  const videos = await fileService.getFiles();
  return Response.json(videos);
};
