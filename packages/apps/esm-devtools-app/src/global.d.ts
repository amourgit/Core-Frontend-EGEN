// Webpack-specific globals
interface NodeRequire {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
    mode?: string
  ): __WebpackModuleApi.RequireContext;
}

// Needed for require.context in webpack
declare namespace __WebpackModuleApi {
  interface RequireContext {
    keys(): string[];
    (id: string): any;
    <T>(id: string): T;
    resolve(id: string): string;
    id: string;
  }
}
