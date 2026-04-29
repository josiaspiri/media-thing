const ffprobe = async <T = any>(args: string[]): Promise<T> => {
  const proc = Bun.spawn(
    ["ffprobe", "-v", "quiet", "-print_format", "json", ...args],
    { stderr: "ignore", stdout: "pipe" },
  );
  const [data, code] = await Promise.all([proc.stdout.json(), proc.exited]);
  if (code !== 0) throw new Error(`ffprobe error ${code}`);
  return data;
};
