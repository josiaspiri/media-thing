export type CodecTypes = "video" | "audio" | "subtitle";
export interface Stream {
  codec_type: CodecTypes;
}
