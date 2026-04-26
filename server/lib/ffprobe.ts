export const probeMedia = async (filepath: string) => {
  const proc = Bun.spawn([
    "ffprobe",
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_streams",
    filepath,
  ], { stderr: "ignore", stdout: "pipe" });
  const [data, code] = await Promise.all([proc.stdout.json(), proc.exited]);
  if (code !== 0) throw new Error(`ffprobe exited with code ${code}`);
  return data;
};
