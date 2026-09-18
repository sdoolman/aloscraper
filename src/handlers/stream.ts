import { aloClient } from '../aloClient';

interface StremioStream {
  name: string;
  title: string;
  url: string;
  behaviorHints?: {
    notWebReady?: boolean;
  };
}

export async function streamHandler(args: { type: string; id: string }) {
  let entryId: string | undefined;

  // 1. Format: alo:entry_12345 or alo:entry_12345:1:1 or alo:12345
  const entryMatch = args.id.match(/^alo:(?:entry_)?(\d+)(?::\d+:\d+)?$/);
  if (entryMatch && !args.id.startsWith('alo:plan_')) {
    entryId = entryMatch[1];
  } else {
    // 2. Format: alo:plan_615:1:1
    const planMatch = args.id.match(/^alo:(?:plan_)?(\d+):(\d+):(\d+)$/);
    if (planMatch) {
      const planId = planMatch[1];
      const episodeNum = parseInt(planMatch[3], 10);
      const entries = await aloClient.getPlanEntries(planId);
      if (entries && entries.length >= episodeNum && episodeNum > 0) {
        entryId = String(entries[episodeNum - 1].id);
      }
    }
  }

  if (!entryId) {
    throw new Error(`Invalid Alo workout entry ID: ${args.id}`);
  }

  const entry = await aloClient.getPlanEntry(entryId);

  const streams: StremioStream[] = [];
  const video = entry.video;

  if (video) {
    // 1. Adaptive HLS master playlist (BunnyCDN, up to 1080p)
    if (video.hls) {
      streams.push({
        name: 'Alo Moves',
        title: 'Adaptive HLS (1080p / 720p / 480p)',
        url: video.hls,
      });
    }

    // 2. Direct MP4 options (useful for clients or players that prefer progressive download)
    if (video.mp4_720) {
      streams.push({
        name: 'Alo Moves',
        title: 'Direct MP4 (720p HD)',
        url: video.mp4_720,
      });
    }

    if (video.mp4_480) {
      streams.push({
        name: 'Alo Moves',
        title: 'Direct MP4 (480p SD)',
        url: video.mp4_480,
      });
    }
  }

  if (streams.length === 0) {
    console.warn(`No streams found or unlocked for entry ${entryId}.`);
  }

  return { streams };
}
