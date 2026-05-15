import type { Stream } from "../types/ffprobe";

const ffprobe = async <T = any>(args: string[]): Promise<T> => {
  const proc = Bun.spawn(
    ["ffprobe", "-v", "quiet", "-print_format", "json", ...args],
    { stderr: "ignore", stdout: "pipe" },
  );
  const [data, code] = await Promise.all([proc.stdout.json(), proc.exited]);
  if (code !== 0) throw new Error(`ffprobe error ${code}`);
  return data;
};

export const getVideoStreams = async (filepath: string) => {
  const data = await ffprobe<{ streams: Stream[] }>([
    "-show_streams",
    filepath,
  ]);
  return data.streams;
};

export const getVideoDuration = async (inputPath: string) => {
  const data = await ffprobe<{ format: { duration: string } }>([
    "-show_format",
    inputPath,
  ]);
  return parseFloat(data.format.duration);
};
