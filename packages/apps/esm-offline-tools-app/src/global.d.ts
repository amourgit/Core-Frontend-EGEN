// Webpack-specific globals
interface NodeRequire {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string): __WebpackModuleApi.RequireContext;
}
declare namespace __WebpackModuleApi {
  interface RequireContext {
    keys(): string[];
    (id: string): any;
    resolve(id: string): string;
    id: string;
  }
}
