import { AloPlan } from '../types/alo';

export function extractCategory(plan: AloPlan): string | undefined {
  if (typeof plan.primary_category === 'string' && plan.primary_category.trim()) {
    return plan.primary_category.trim();
  }
  if (plan.primary_category && typeof plan.primary_category === 'object') {
    const cat =
      plan.primary_category.title ||
      plan.primary_category.name ||
      plan.primary_category.slug;
    if (typeof cat === 'string' && cat.trim()) {
      return cat.trim();
    }
  }
  if (typeof plan.category === 'string' && plan.category.trim()) {
    return plan.category.trim();
  }
  return undefined;
}

export function extractCoaches(plan: AloPlan): string[] {
  if (!plan.coaches || !Array.isArray(plan.coaches)) return [];
  const names: string[] = [];
  for (const c of plan.coaches) {
    if (typeof c === 'string' && c.trim()) {
      names.push(c.trim());
    } else if (c && typeof c === 'object') {
      if (c.user?.name && typeof c.user.name === 'string' && c.user.name.trim()) {
        names.push(c.user.name.trim());
      } else if (c.first_name || c.last_name) {
        const full = `${c.first_name || ''} ${c.last_name || ''}`.trim();
        if (full) names.push(full);
      } else if ((c as any).name && typeof (c as any).name === 'string') {
        const name = (c as any).name.trim();
        if (name) names.push(name);
      }
    }
  }
  return [...new Set(names)];
}

export function extractPoster(plan: AloPlan): string | undefined {
  if (plan.cover_photo && typeof plan.cover_photo === 'object' && plan.cover_photo.url) {
    return plan.cover_photo.url;
  }
  if (typeof plan.cover_photo === 'string' && plan.cover_photo.startsWith('http')) {
    return plan.cover_photo;
  }
  if (typeof plan.thumbnail_image === 'string' && plan.thumbnail_image.startsWith('http')) {
    return plan.thumbnail_image;
  }
  if (typeof plan.banner_photo_url === 'string' && plan.banner_photo_url.startsWith('http')) {
    return plan.banner_photo_url;
  }
  if (typeof plan.banner_photo_mobile_url === 'string' && plan.banner_photo_mobile_url.startsWith('http')) {
    return plan.banner_photo_mobile_url;
  }
  return undefined;
}

export function extractBackground(plan: AloPlan): string | undefined {
  if (typeof plan.banner_photo_url === 'string' && plan.banner_photo_url.startsWith('http')) {
    return plan.banner_photo_url;
  }
  return extractPoster(plan);
}

export function formatDuration(durationInMs?: number, humanDuration?: string): string | undefined {
  if (humanDuration) {
    const parts = humanDuration.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !parts.some(isNaN)) {
      const minutes = parts[0];
      return minutes > 0 ? `${minutes} min` : '< 1 min';
    } else if (parts.length === 3 && !parts.some(isNaN)) {
      const hours = parts[0];
      const minutes = parts[1];
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
    }
  }

  if (durationInMs && durationInMs > 0) {
    const min = Math.round(durationInMs / 60000);
    return min > 0 ? `${min} min` : '< 1 min';
  }

  return undefined;
}

