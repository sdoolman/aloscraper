import { aloClient } from '../aloClient';
import {
  extractBackground,
  extractCategory,
  extractCoaches,
  extractPoster,
  formatDuration,
} from '../utils/formatters';

export async function metaHandler(args: { type: string; id: string }) {
  const match = args.id.match(/^alo:(?:plan_)?(\d+)$/);
  if (!match) {
    throw new Error(`Invalid Alo plan ID: ${args.id}`);
  }

  const planId = match[1];
  const [plan, entries] = await Promise.all([
    aloClient.getProgram(planId),
    aloClient.getPlanEntries(planId),
  ]);

  const poster = extractPoster(plan);
  const background = extractBackground(plan);
  const category = extractCategory(plan);
  const coaches = extractCoaches(plan);

  const genres: string[] = [];
  if (category) genres.push(category);
  if (plan.difficulty_level) genres.push(plan.difficulty_level);
  for (const coach of coaches) {
    if (!genres.includes(coach)) genres.push(coach);
  }

  const videos = entries.map((entry, idx) => {
    const thumbnail =
      entry.video_thumbnail ||
      entry.photo?.url ||
      entry.video?.thumbnail?.play?.url ||
      entry.video?.thumbnail?.url ||
      poster;

    const runtimeMinutes = entry.duration_in_ms
      ? Math.round(entry.duration_in_ms / 60000)
      : undefined;

    const durationStr = formatDuration(entry.duration_in_ms, entry.human_duration);
    const baseTitle = entry.title || `Class ${idx + 1}`;
    // Append (XX min) if duration is available and not already in the title
    const hasDurationInTitle = /\(\s*\d+\s*(?:min|m)\s*\)/i.test(baseTitle);
    const title = durationStr && !hasDurationInTitle ? `${baseTitle} (${durationStr})` : baseTitle;

    const released = (entry as any).created_at
      ? new Date((entry as any).created_at).toISOString()
      : undefined;

    return {
      id: `alo:entry_${entry.id}`,
      title,
      season: 1,
      episode: idx + 1,
      overview: entry.description || entry.preview_description || '',
      thumbnail,
      runtime: runtimeMinutes,
      released,
    };
  });

  const releaseYear = plan.release_date
    ? new Date(plan.release_date).getFullYear().toString()
    : undefined;

  return {
    meta: {
      id: `alo:plan_${planId}`,
      type: 'series',
      name: plan.title,
      poster,
      posterShape: 'landscape',
      background,
      description: plan.description,
      genres,
      cast: coaches.length > 0 ? coaches : undefined,
      director: coaches.length > 0 ? coaches : undefined,
      releaseInfo: releaseYear,
      videos,
    },
  };
}
