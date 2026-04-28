import { serve } from "bun";
import index from "@/client/index.html";
import { getSupportedStream, getVideosApi } from "./handlers/video.handler";

const server = serve({
  routes: {
    "/*": index,
    "/api/videos": {
      GET: getVideosApi,
    },
    "/video/*": {
      GET: getSupportedStream,
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
