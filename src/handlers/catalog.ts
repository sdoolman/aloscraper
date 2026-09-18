import { aloClient } from '../aloClient';
import { AloPlan } from '../types/alo';
import {
  extractBackground,
  extractCategory,
  extractCoaches,
  extractPoster,
} from '../utils/formatters';

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

    const classCount = plan.workout_count || plan.classes_count;
    const description =
      plan.description ||
      (classCount ? `${classCount} classes` : undefined);

    return {
      id: `alo:plan_${plan.id}`,
      type: 'series',
      name: plan.title,
      poster,
      background,
      description,
      genres,
    };
  });

  return { metas };
}
