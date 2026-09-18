import { aloClient } from '../aloClient';

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

  const poster =
    plan.cover_photo?.url ||
    plan.banner_photo_url ||
    plan.banner_photo_mobile_url;

  const genres: string[] = [];
  if (plan.primary_category) genres.push(plan.primary_category);
  if (plan.difficulty_level) genres.push(plan.difficulty_level);
  if (plan.coaches && plan.coaches.length > 0) {
    for (const c of plan.coaches) {
      if (c.user?.name) genres.push(c.user.name);
    }
  }

  const videos = entries.map((entry, idx) => {
    const thumbnail =
      entry.video_thumbnail ||
      entry.video?.thumbnail?.play?.url ||
      entry.video?.thumbnail?.url ||
      entry.photo?.url ||
      poster;

    const runtimeMinutes = entry.duration_in_ms
      ? Math.round(entry.duration_in_ms / 60000)
      : undefined;

    return {
      id: `alo:entry_${entry.id}`,
      title: entry.title,
      season: 1,
      episode: idx + 1,
      overview: entry.description || entry.preview_description,
      thumbnail,
      runtime: runtimeMinutes,
    };
  });

  return {
    meta: {
      id: args.id,
      type: 'series',
      name: plan.title,
      poster,
      background: plan.banner_photo_url,
      description: plan.description,
      genres,
      videos,
    },
  };
}
