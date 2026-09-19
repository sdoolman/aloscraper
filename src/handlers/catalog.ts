import { aloClient } from '../aloClient';
import { AloPlan } from '../types/alo';
import {
  extractBackground,
  extractCategory,
  extractCoaches,
  extractPoster,
} from '../utils/formatters';

function resolveCatalogQuery(catalogId: string, genre?: string): string {
  if (genre) {
    switch (genre) {
      case 'All Yoga':
        return 'Yoga';
      case 'All Fitness':
        return 'Fitness';
      case 'All Mindfulness':
        return 'Mindfulness';
      case 'All Wellness':
        return 'Wellness';
      case 'All Skills':
        return 'Skills';
      case '5-15 mins':
        return '15 minute';
      case '15-30 mins':
        return '20 minute';
      case '30-45 mins':
        return '30 minute';
      case '45-60 mins':
        return '45 minute';
      case '60+ mins':
        return '60 minute';
      case 'No Equipment':
        return 'Bodyweight';
      case 'Level 1':
        return 'Beginner';
      case 'Level 2':
        return 'Moderate';
      case 'Level 3':
        return 'Intermediate';
      case 'Level 4':
        return 'Advanced';
      default:
        return genre;
    }
  }

  // Fallback defaults if no genre filter is selected
  switch (catalogId) {
    case 'alo_yoga':
      return 'Yoga';
    case 'alo_fitness':
      return 'Fitness';
    case 'alo_mindfulness':
      return 'Mindfulness';
    case 'alo_wellness':
      return 'Wellness';
    case 'alo_skills':
      return 'Skills';
    case 'alo_duration':
      return '15 minute';
    case 'alo_focus':
      return 'Full Body';
    case 'alo_equipment':
      return 'Bodyweight';
    case 'alo_difficulty':
      return 'Beginner';
    case 'alo_intensity':
      return 'Beginner';
    case 'alo_instructors':
      return 'Dylan Werner';
    default:
      return 'Yoga';
  }
}

export async function catalogHandler(args: {
  type: string;
  id: string;
  extra?: { search?: string; genre?: string; skip?: number };
}) {
  const { id, extra } = args;
  let plans: AloPlan[] = [];

  if (extra?.search) {
    plans = await aloClient.searchPrograms(extra.search);
  } else if (id === 'alo_series' && !extra?.genre) {
    plans = await aloClient.getFeaturedPrograms();
  } else {
    const query = resolveCatalogQuery(id, extra?.genre);
    plans = await aloClient.searchPrograms(query);
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
      posterShape: 'landscape',
      background,
      description,
      genres,
    };
  });

  return { metas };
}
