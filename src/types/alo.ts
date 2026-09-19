export interface AloPlan {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  category?: string;
  primary_category?:
    | string
    | {
        id?: number;
        title?: string;
        name?: string;
        slug?: string;
      };
  cover_photo?:
    | {
        url?: string;
      }
    | string;
  thumbnail_image?: string;
  banner_photo?: string;
  banner_photo_url?: string;
  banner_photo_mobile?: string;
  banner_photo_mobile_url?: string;
  workout_count?: number;
  classes_count?: number;
  difficulty_level?: string;
  release_date?: string;
  coaches?: Array<
    | string
    | {
        first_name?: string;
        last_name?: string;
        name?: string;
        user?: { name: string };
        coach_info?: { slug: string; tag_line?: string };
        coachInfo?: { slug: string };
      }
  >;
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

export interface AloStructuredSection {
  title?: string;
  description?: string;
  items?: Array<{
    item_type?: string;
    item_tag?: string;
    description?: string;
    item?: AloPlanEntry;
  }>;
}

export interface AloPlanEntriesResponse {
  sections?: AloStructuredSection[];
}

