import HLS from "hls.js";
import { useEffect, useRef, useState } from "react";
import { getVideos } from "../services/api.service";
import type { Video } from "../types";

export const App = () => {
  const [source, setSource] = useState<Video | undefined>(undefined);
  const [videos, setVideos] = useState<Video[] | undefined>(undefined);
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
    const video = videoRef.current;
    if (!video || !source) return;

    if (!source.endsWith(".mkv")) {
      video.src = `/video/${source}`;
      video.play();

      return () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    const hlsSrc = `/hls-video/${source}/index.m3u8`;

    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(hlsSrc);
      hls.attachMedia(video);
      hls.once(HLS.Events.MANIFEST_PARSED, () => video.play());
      return () => hls.destroy();
    }
  }, [source]);

  return (
    <main>
      <h1>Media Thing</h1>
      {source && <video ref={videoRef} src={source} controls />}

      <ul>
        {videos?.map((video) => (
          <li key={video}>
            <button onClick={() => setSource(video)}>
              {video.split("/").pop()?.split(".").shift()}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};
