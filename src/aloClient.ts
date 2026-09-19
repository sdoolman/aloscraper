import { config } from './config';
import {
  AloPlan,
  AloPlanEntry,
  AloPlanEntriesResponse,
  AloProgramFinderData,
  AloSearchResponse,
} from './types/alo';

class AloClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = config.aloBaseUrl;
    this.token = config.aloRememberToken;
  }

  private getHeaders(authenticated = false): HeadersInit {
    const headers: Record<string, string> = {
      accept: 'application/json, text/plain, */*',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
      referer: config.aloOrigin + '/',
    };

    if (authenticated && this.token) {
      headers['cookie'] = `remember_token=${this.token}`;
    }

    return headers;
  }

  async getFeaturedPrograms(): Promise<AloPlan[]> {
    const res = await fetch(`${this.baseUrl}/plans/program_finder/data`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch featured programs: HTTP ${res.status}`);
    }
    const data = (await res.json()) as AloProgramFinderData;
    return data.featured_products || [];
  }

  async searchPrograms(query: string): Promise<AloPlan[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.getFeaturedPrograms();
    }
    const res = await fetch(
      `${this.baseUrl}/search/series?q=${encodeURIComponent(trimmed)}`,
      {
        headers: this.getHeaders(false),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to search programs: HTTP ${res.status}`);
    }
    const data = (await res.json()) as AloSearchResponse;
    return data.top || [];
  }

  async getProgram(planId: string | number): Promise<AloPlan> {
    const res = await fetch(`${this.baseUrl}/plans/${planId}`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch program ${planId}: HTTP ${res.status}`);
    }
    return (await res.json()) as AloPlan;
  }

  async getPlanEntries(
    planId: string | number
  ): Promise<AloPlanEntry[] | AloPlanEntriesResponse> {
    const res = await fetch(`${this.baseUrl}/plans/${planId}/plan_entries`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch entries for plan ${planId}: HTTP ${res.status}`
      );
    }
    return (await res.json()) as AloPlanEntry[] | AloPlanEntriesResponse;
  }

  async getPlanEntry(entryId: string | number): Promise<AloPlanEntry> {
    const res = await fetch(`${this.baseUrl}/plan_entries/${entryId}`, {
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch plan entry ${entryId}: HTTP ${res.status}`
      );
    }
    return (await res.json()) as AloPlanEntry;
  }
}

export const aloClient = new AloClient();
