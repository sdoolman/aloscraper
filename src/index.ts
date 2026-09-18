import { addonBuilder, serveHTTP } from 'stremio-addon-sdk';
import { config } from './config';
import { manifest } from './manifest';
import { catalogHandler } from './handlers/catalog';
import { metaHandler } from './handlers/meta';
import { streamHandler } from './handlers/stream';

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async (args: any) => {
  try {
    return await catalogHandler(args);
  } catch (err: any) {
    console.error('[Catalog Error]', err.message);
    return { metas: [] };
  }
});

builder.defineMetaHandler(async (args: any) => {
  try {
    return await metaHandler(args);
  } catch (err: any) {
    console.error('[Meta Error]', err.message);
    return { meta: null as any };
  }
});

builder.defineStreamHandler(async (args: any) => {
  try {
    return await streamHandler(args);
  } catch (err: any) {
    console.error('[Stream Error]', err.message);
    return { streams: [] };
  }
});

const addonInterface = builder.getInterface();

serveHTTP(addonInterface, { port: config.port });

console.log(`[AloMoves Stremio Addon] Running at http://127.0.0.1:${config.port}/manifest.json`);
