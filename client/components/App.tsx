import HLS from "hls.js";
import { useEffect, useRef, useState } from "react";
import { getVideos } from "../services/api.service";
import type { Video } from "../types";

export const App = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const videoElm = videoRef.current;
    if (!videoElm || !video) return;
    const { filename, id } = video;
    if (!filename.endsWith(".mkv")) {
      videoElm.src = `/video/${id}`;
      videoElm.play();

      return () => {
        videoElm.pause();
        videoElm.removeAttribute("src");
        videoElm.load();
      };
    }

    const hlsSrc = `/hls-video/${id}/index.m3u8`;

    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(hlsSrc);
      hls.attachMedia(videoElm);
      hls.once(HLS.Events.MANIFEST_PARSED, () => videoElm.play());
      return () => hls.destroy();
    }
  }, [video]);

  return (
    <main>
      <h1>Media Thing</h1>
      <video ref={videoRef} controls />

      <ul>
        {videos?.map((video) => (
          <li key={video.id}>
            <button onClick={() => setVideo(video)}>
              {video.filename}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};
