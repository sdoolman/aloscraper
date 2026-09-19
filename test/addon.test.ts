import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { manifest } from '../src/manifest';
import { catalogHandler } from '../src/handlers/catalog';
import { metaHandler } from '../src/handlers/meta';
import { streamHandler } from '../src/handlers/stream';
import { config } from '../src/config';

describe('Alo Moves Stremio Addon Test Suite', () => {
  it('should have a valid Stremio Addon manifest with 11 catalogs', () => {
    assert.equal(manifest.id, 'org.sdoolman.alomoves');
    assert.ok(manifest.name.includes('Alo'));
    assert.equal(manifest.resources.length, 3);
    assert.equal(manifest.resources[0], 'catalog');
    assert.deepEqual(manifest.types, ['series']);
    assert.deepEqual(manifest.idPrefixes, ['alo:']);
    assert.equal(manifest.catalogs.length, 11);
    assert.equal(manifest.catalogs[0].id, 'alo_yoga');
    assert.equal((manifest.catalogs[0] as any).posterShape, 'landscape');
  });

  it('should fetch yoga catalog with subcategories', async () => {
    const result = await catalogHandler({
      type: 'series',
      id: 'alo_yoga',
      extra: { genre: 'Vinyasa' },
    });

    assert.ok(result.metas.length > 0, 'Catalog should return Vinyasa series');
    const first = result.metas[0];
    assert.ok(first.id.startsWith('alo:plan_'), 'ID should follow alo:plan_ format');
    assert.ok(first.name, 'Series should have a title');
    assert.ok(first.poster?.startsWith('http'), 'Series should have a valid poster URL');
    assert.equal((first as any).posterShape, 'landscape');
    assert.ok(
      first.genres.every((g) => typeof g === 'string'),
      'All genres must be strings'
    );
  });

  it('should fetch fitness catalog with subcategories', async () => {
    const result = await catalogHandler({
      type: 'series',
      id: 'alo_fitness',
      extra: { genre: 'HIIT' },
    });

    assert.ok(result.metas.length > 0, 'Genre query should return programs');
    const first = result.metas[0];
    assert.ok(first.name, 'Program should have a title');
    assert.ok(first.poster?.startsWith('http'), 'Genre program must have a valid poster URL');
    assert.equal((first as any).posterShape, 'landscape');
    assert.ok(
      first.genres.every((g) => typeof g === 'string'),
      'All genres must be strings'
    );
  });

  it('should search series dynamically by query', async () => {
    const result = await catalogHandler({
      type: 'series',
      id: 'alo_series',
      extra: { search: 'wild' },
    });

    assert.ok(result.metas.length > 0, 'Search for "wild" should return programs');
    const hasWild = result.metas.some((m) => m.name.toLowerCase().includes('wild'));
    assert.ok(hasWild, 'Search results should include series with "wild" in title');
    assert.ok(result.metas[0].poster?.startsWith('http'), 'Search result must have a valid poster URL');
  });

  it('should resolve series metadata, episodes, and graphics for plan 615', async () => {
    // Plan 615: Yoga Basics
    const result = await metaHandler({
      type: 'series',
      id: 'alo:plan_615',
    });

    assert.ok(result.meta, 'Meta response should not be empty');
    assert.equal(result.meta.id, 'alo:plan_615');
    assert.ok(result.meta.name.includes('Yoga Basics'), 'Title should match Yoga Basics');
    assert.equal((result.meta as any).posterShape, 'landscape');
    assert.ok(result.meta.poster?.startsWith('http'), 'Poster must be a valid URL');
    assert.ok(result.meta.background?.startsWith('http'), 'Background hero image must be a valid URL');
    assert.ok(
      result.meta.genres.every((g) => typeof g === 'string'),
      'All genres must be strings'
    );
    assert.ok(result.meta.videos.length > 0, 'Should have classes/episodes listed');

    const firstEp = result.meta.videos[0];
    assert.equal(firstEp.season, 1, 'Season should be 1');
    assert.ok(firstEp.episode >= 1, 'Episode should be >= 1');
    assert.ok(firstEp.id.startsWith('alo:entry_'), 'Episode ID should follow alo:entry_ format');
    assert.ok(firstEp.thumbnail?.startsWith('http'), 'Episode must have a thumbnail image URL');
  });

  it('should resolve structured multi-week programs into seasons (e.g. plan 3393)', async () => {
    // Plan 3393: Ready, Set, Run (5-week structured program)
    const result = await metaHandler({
      type: 'series',
      id: 'alo:plan_3393',
    });

    assert.ok(result.meta, 'Meta response should not be empty');
    assert.equal(result.meta.id, 'alo:plan_3393');
    assert.ok(result.meta.name.includes('Ready, Set, Run'));
    assert.ok(result.meta.videos.length >= 10, 'Structured plan should have multiple classes');
    const seasons = [...new Set(result.meta.videos.map((v) => v.season))];
    assert.ok(seasons.length > 1, 'Structured series should map sections to multiple seasons');
    assert.ok(result.meta.videos[0].title.includes('Run 1'), 'Title should include item_tag');
  });

  it('should resolve live video stream from BunnyCDN when authenticated', async (t) => {
    if (!config.aloRememberToken) {
      t.skip('Skipping live stream resolution test: ALO_REMEMBER_TOKEN not set');
      return;
    }

    // Class 14529: 5-Minute Back Core
    const result = await streamHandler({
      type: 'series',
      id: 'alo:entry_14529',
    });

    assert.ok(result.streams.length > 0, 'Should return at least 1 stream');
    const hls = result.streams.find((s) => s.url.includes('.m3u8'));
    assert.ok(hls, 'Should have an adaptive HLS stream');
    assert.ok(hls.url.includes('video-cdn.alomoves.com'), 'Stream must come from Alo video-cdn');

    // Live HTTP check against BunnyCDN
    const cdnCheck = await fetch(hls.url, {
      method: 'GET',
      headers: { Range: 'bytes=0-100' },
    });
    assert.ok(
      cdnCheck.status === 200 || cdnCheck.status === 206,
      `BunnyCDN should return HTTP 200/206, got ${cdnCheck.status}`
    );
  });
});
