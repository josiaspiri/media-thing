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
    videoRef.current?.play();
  }, [source]);

  return (
    <main>
      <h1>Media Thing</h1>
      {source && <video ref={videoRef} src={source} controls />}

      <ul>
        {videos?.map((video) => (
          <li key={video}>
            <button
              onClick={() => setSource(`/video/${video}`)}
            >
              {video.split("/").pop()?.split(".").shift()}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};
