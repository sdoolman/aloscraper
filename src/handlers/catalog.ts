import { aloClient } from '../aloClient';
import { AloPlan } from '../types/alo';

export async function catalogHandler(args: {
  type: string;
  id: string;
  extra?: { search?: string; genre?: string; skip?: number };
}) {
  const { extra } = args;
  let plans: AloPlan[] = [];

  if (extra?.search) {
    plans = await aloClient.searchPrograms(extra.search);
  } else if (extra?.genre && extra.genre !== 'Featured') {
    plans = await aloClient.searchPrograms(extra.genre);
  } else {
    plans = await aloClient.getFeaturedPrograms();
  }

  const metas = plans.map((plan) => {
    const poster =
      plan.cover_photo?.url ||
      plan.banner_photo_url ||
      plan.banner_photo_mobile_url;

    return {
      id: `alo:plan_${plan.id}`,
      type: 'series',
      name: plan.title,
      poster,
      background: plan.banner_photo_url,
      description:
        plan.description ||
        (plan.workout_count ? `${plan.workout_count} classes` : undefined),
      genres: plan.primary_category ? [plan.primary_category] : [],
    };
  });

  return { metas };
}
