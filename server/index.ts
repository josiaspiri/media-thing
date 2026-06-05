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
  },

  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const upgradeHeader = req.headers.get("upgrade");
      if (upgradeHeader === "websocket") {
        const success = server.upgrade(req);
        return success ? undefined : RESPONSES.BAD_REQUEST();
      } else {
        return RESPONSES.NOT_FOUND();
      }
    }
    return RESPONSES.NOT_FOUND();
  },

  websocket: {
    message(ws, message) {},
    open(ws) {},
    close(ws, code, reason) {},
    drain(ws) {},
    ping(ws, data) {},
    pong(ws, data) {},
    sendPings: true,
    idleTimeout: 30,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
