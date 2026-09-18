export interface AloPlan {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  cover_photo?: {
    url?: string;
  };
  banner_photo_url?: string;
  banner_photo_mobile_url?: string;
  workout_count?: number;
  difficulty_level?: string;
  primary_category?: string;
  coaches?: Array<{
    user?: { name: string };
    coachInfo?: { slug: string };
  }>;
}

export interface AloPlanEntry {
  id: number;
  title: string;
  duration_in_ms?: number;
  human_duration?: string;
  difficulty_level?: string;
  description?: string;
  preview_description?: string;
  video_thumbnail?: string;
  photo?: { url?: string };
  unlocked?: boolean;
  video?: {
    id: number;
    title?: string;
    duration_in_ms?: number;
    hls?: string;
    mp4_720?: string;
    mp4_480?: string;
    mp4_360?: string;
    resolutions?: Array<{
      name: string;
      src: string;
    }>;
    thumbnail?: {
      url?: string;
      play?: { url?: string };
    };
  };
}

export interface AloProgramFinderData {
  featured_products?: AloPlan[];
  categories?: Array<{
    id: number;
    slug: string;
    title?: string;
    name?: string;
  }>;
}

export interface AloSearchResponse {
  result_count: number;
  top: AloPlan[];
}
