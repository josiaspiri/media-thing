# Media Thing
A media server for those who want to quickly and simply share media across the LAN.

## To Do
- eviction policy for transcode cache
- complete the mkv subtitle functionality
- complete bundled client
    - more of an hls.js test ground currently
- thumbnails and hover video preview generation
- _perhaps_ add image/audio support to better reflect the name
- ~better~ process management
    - queueing
- usage documentation

## Why?
A few reasons:
- I have media I sometimes wish to quickly and simply share across my LAN
- I wanted to make something with a focus on Bun's full stack single file executable compilation
- It closes my knowledge gap about hls, multimedia containers, and ffmpeg in a practical way

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```
