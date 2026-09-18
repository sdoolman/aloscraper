declare module 'stremio-addon-sdk' {
  export class addonBuilder {
    constructor(manifest: any);
    defineCatalogHandler(handler: (args: any) => Promise<any>): void;
    defineMetaHandler(handler: (args: any) => Promise<any>): void;
    defineStreamHandler(handler: (args: any) => Promise<any>): void;
    getInterface(): any;
  }

  export function serveHTTP(addonInterface: any, options: { port: number }): void;
}
