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

  const videos: any[] = [];

  if (Array.isArray(entries)) {
    entries.forEach((entry, idx) => {
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
      const hasDurationInTitle = /\(\s*\d+\s*(?:min|m)\s*\)/i.test(baseTitle);
      const title = durationStr && !hasDurationInTitle ? `${baseTitle} (${durationStr})` : baseTitle;

      const released = (entry as any).created_at
        ? new Date((entry as any).created_at).toISOString()
        : undefined;

      videos.push({
        id: `alo:entry_${entry.id}`,
        title,
        season: 1,
        episode: idx + 1,
        overview: entry.description || entry.preview_description || '',
        thumbnail,
        runtime: runtimeMinutes,
        released,
      });
    });
  } else if (entries && Array.isArray((entries as any).sections)) {
    const sections = (entries as any).sections;
    sections.forEach((sec: any, secIdx: number) => {
      const season = secIdx + 1;
      const items = sec.items || [];
      let ep = 1;
      for (const it of items) {
        const entry = it.item || it;
        if (!entry || !entry.id) continue;

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
        const tag = it.item_tag ? `${it.item_tag}: ` : '';
        const baseTitle = `${tag}${entry.title || `Class ${ep}`}`.trim();
        const hasDurationInTitle = /\(\s*\d+\s*(?:min|m)\s*\)/i.test(baseTitle);
        const title = durationStr && !hasDurationInTitle ? `${baseTitle} (${durationStr})` : baseTitle;

        const released = (entry as any).created_at
          ? new Date((entry as any).created_at).toISOString()
          : undefined;

        videos.push({
          id: `alo:entry_${entry.id}`,
          title,
          season,
          episode: ep++,
          overview: entry.description || entry.preview_description || it.description || '',
          thumbnail,
          runtime: runtimeMinutes,
          released,
        });
      }
    });
  }

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
