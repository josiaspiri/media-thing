import type { Video } from "../types";

export const getVideos = async (): Promise<Video[]> => {
  const res = await fetch("/api/videos");
  if (!res.ok) throw new Error(`getVideos: ${res.status}`);
  return (await res.json()) as Video[];
};
