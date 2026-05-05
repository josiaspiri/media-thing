import { serve } from "bun";
import index from "@/client/index.html";
import { getSupportedStream, getVideosApi } from "./handlers/video.handler";
import { RESPONSES } from "./lib/responses";
import { getHlsPlaylist, getHlsSegment } from "./handlers/hls.handler";

const server = serve({
  routes: {
    "/": index,
    "/api/videos": {
      GET: getVideosApi,
    },
    "/video/:videoId": {
      GET: getSupportedStream,
    },
    "/hls-video/:videoRef/index.m3u8": {
      GET: getHlsPlaylist,
    },
    "/hls-video/:videoRef/:segment": {
      GET: getHlsSegment,
    },
    "/*": {
      GET: RESPONSES.NOT_FOUND(),
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
