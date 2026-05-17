const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { DefinePlugin, container } = require('webpack');
const { basename, dirname, resolve } = require('path');
const { readdirSync, statSync, readFileSync } = require('fs');
const semver = require('semver');
const { removeTrailingSlash, getTimestamp } = require('./tools/helpers');

const { name, version, dependencies } = require('./package.json');
const sharedDependencies = require('./dependencies.json');
const frameworkVersion = require('@egen/esm-framework/package.json').version;

const timestamp = getTimestamp();
const production = 'production';
const allowedSuffixes = ['-app', '-widgets'];
const { ModuleFederationPlugin } = container;

const egenAddCookie = process.env.EGEN_ADD_COOKIE;
const egenApiUrl = removeTrailingSlash(process.env.EGEN_API_URL || '/egen');
const egenPublicPath = removeTrailingSlash(process.env.EGEN_PUBLIC_PATH || '/egen/spa');
const egenProxyTarget = process.env.EGEN_PROXY_TARGET || 'https://dev3.egen.org/';
const egenPageTitle = process.env.EGEN_PAGE_TITLE || 'EGEN';
const egenFavicon = process.env.EGEN_FAVICON || `${egenPublicPath}/favicon.ico`;
const egenEnvironment = process.env.EGEN_ENV || process.env.NODE_ENV || '';
const egenOffline = process.env.EGEN_OFFLINE === 'enable';
const egenDefaultLocale = process.env.EGEN_DEFAULT_LOCALE || 'en';
const egenImportmapDef = process.env.EGEN_IMPORTMAP;
const egenImportmapUrl = process.env.EGEN_IMPORTMAP_URL || `${egenPublicPath}/importmap.json`;
const egenRoutesDef = process.env.EGEN_ROUTES;
const egenRoutesUrl = process.env.EGEN_ROUTES_URL || `${egenPublicPath}/routes.registry.json`;
const egenCoreApps = process.env.EGEN_CORE_APPS_DIR || resolve(__dirname, '../../apps');
const egenConfigUrls = (process.env.EGEN_CONFIG_URLS || '')
  .split(';')
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(', ');
const egenJsCssAssets = (process.env.EGEN_JS_CSS_ASSETS || '')
  .split(';')
  .filter((filePath) => filePath.length > 0);

const egenCleanBeforeBuild =
  (() => {
    try {
      return (
        process.env.EGEN_CLEAN_BEFORE_BUILD === undefined ||
        (typeof process.env.EGEN_CLEAN_BEFORE_BUILD === 'boolean' && process.env.EGEN_CLEAN_BEFORE_BUILD) ||
        (typeof process.env.EGEN_CLEAN_BEFORE_BUILD === 'string' &&
          process.env.EGEN_CLEAN_BEFORE_BUILD.toLowerCase() !== 'false')
      );
    } catch {
      // this is intensionally a no-op
    }

    return undefined;
  })() ?? true;

function checkDirectoryExists(dirName) {
  if (dirName) {
    try {
      return statSync(dirName).isDirectory();
    } catch {
      return false;
    }
  }
  return false;
}

function checkFileExists(filename) {
  if (filename) {
    try {
      return statSync(filename).isFile();
    } catch {
      return false;
    }
  }
  return false;
}

function checkDirectoryHasContents(dirName) {
  if (checkDirectoryExists(dirName)) {
    const contents = readdirSync(dirName);
    return contents.length > 0;
  } else {
    return false;
  }
}

// taken from: https://stackoverflow.com/a/6969486
// this function is CC BY-SA 4.0
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {Record<string, string>} env
 * @param {Array<string>} argv
 * @returns {import("webpack").Configuration}
 */
module.exports = (env, argv = []) => {
  const mode = argv.mode || process.env.NODE_ENV || production;
  const outDir = mode === production ? 'dist' : 'lib';
  const isProd = mode === 'production';
  const appPatterns = [];

  const coreImportmap = {
    imports: {},
  };

  const coreRoutes = {};

  if (!isProd && checkDirectoryExists(egenCoreApps)) {
    readdirSync(egenCoreApps).forEach((dir) => {
      const appDir = resolve(egenCoreApps, dir);
      if (checkDirectoryExists(appDir)) {
        const { name, browser } = require(resolve(appDir, 'package.json'));
        const distDir = resolve(appDir, dirname(browser));
        if (allowedSuffixes.some((suffix) => name.endsWith(suffix))) {
          if (checkDirectoryHasContents(distDir)) {
            appPatterns.push({
              from: distDir,
              to: dir,
            });

            coreImportmap.imports[name] = `./${dir}/${basename(browser)}`;

            const routesFile = resolve(distDir, 'routes.json');
            if (checkFileExists(routesFile)) {
              coreRoutes[name] = JSON.parse(readFileSync(routesFile));
            }
          } else {
            console.warn(`Not serving ${name} because couldn't find ${distDir}`);
          }
        }
      }
    });
  }

  const assetsPatterns = egenJsCssAssets.map(asset => ({from: asset, to: 'assets'}));

  return {
    entry: resolve(__dirname, 'src/index.ts'),
    output: {
      filename: isProd ? 'egen.[contenthash].js' : 'egen.js',
      chunkFilename: '[chunkhash].js',
      path: resolve(__dirname, outDir),
      publicPath: '',
      hashFunction: 'xxhash64',
    },
    target: 'web',
    devServer: {
      compress: true,
      open: [`${egenPublicPath}/`.substring(1)],
      devMiddleware: {
        publicPath: `${egenPublicPath}/`,
      },
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^${escapeRegExp(egenPublicPath)}/.*(?!\\.(?!html).+$)`),
            to: `${egenPublicPath}/index.html`,
          },
        ],
      },
      proxy: [
        {
          /**
           * @param {String} path
           */
          context(path) {
            if (!path) {
              return false;
            }

            if (path.startsWith(egenPublicPath)) {
              if (basename(path).indexOf('.') >= 0) {
                return true;
              } else {
                return false;
              }
            }

            if (path.startsWith(egenApiUrl)) {
              return true;
            }

            return false;
          },
          target: egenProxyTarget,
          changeOrigin: true,
          /**
           * @param {Request} proxyReq
           */
          onProxyReq(proxyReq) {
            if (egenAddCookie) {
              const origCookie = proxyReq.getHeader('cookie');
              const newCookie = `${origCookie};${egenAddCookie}`;
              proxyReq.setHeader('cookie', newCookie);
            }
          },
          /**
           * @param {Response} proxyRes
           */
          onProxyRes(proxyRes) {
            if (proxyRes.headers) {
              delete proxyRes.headers['content-security-policy'];
            }
          },
          /**
           * @param {string} path
           * @param {Request} req
           * @returns {string}
           */
          pathRewrite(path) {
            if (path.startsWith(egenPublicPath)) {
              const matcher = /^.*\/([^\/]*\.(?!html|js)[^.]+)$/i.exec(path);
              if (matcher) {
                return `${egenPublicPath}/${matcher[1]}`;
              }
            }

            return path;
          },
        },
      ],
      static: ['src/assets'],
    },
    watchOptions: {
      ignored: ['.git', 'test-results'],
    },
    mode,
    devtool: isProd ? 'hidden-nosources-source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /egen-esm-styleguide.css$/,
          use: [
            isProd
              ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.css$/,
          exclude: [/egen-esm-styleguide.css$/],
          use: [
            isProd
              ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd
              ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
            {
              loader: require.resolve('sass-loader'),
              options: { sassOptions: { quietDeps: true } },
            },
          ],
        },
        {
          test: /\.(woff|woff2|png)?$/,
          type: 'asset/resource',
        },
        {
          test: /\.(svg|html)$/,
          type: 'asset/source',
        },
        {
          test: /\.(j|t)sx?$/,
          use: [
            {
              loader: 'swc-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        maxAsyncRequests: 3,
        maxInitialRequests: 1,
      },
    },
    resolve: {
      // extensionAlias: résout les imports TypeScript ESM (.js → .ts/.tsx)
      // Nécessaire car esm-framework/esm-styleguide utilisent moduleResolution:node16
      // qui impose des extensions .js explicites dans les imports TypeScript.
      extensionAlias: {
        '.js':  ['.ts', '.tsx', '.js'],
        '.jsx': ['.tsx', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
        '.cjs': ['.cts', '.cjs'],
      },
      mainFields: ['module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
      fallback: {
        http: false,
        stream: false,
        https: false,
        zlib: false,
        url: false,
      },
      alias: {
        '@': resolve(__dirname, 'src'),
        // ─── FIX: force react & react-dom vers une instance singleton unique ───────
        // Sans cet alias, npm workspace peut installer une copie locale de react-dom
        // dans esm-react-utils/node_modules/ — ce qui casse createRoot() avec :
        //   "Cannot set properties of undefined (setting 'usingClientEntryPoint')"
        // car les __SECRET_INTERNALS__ de la copie locale ne sont pas initialisés
        // par rapport à l'instance MF partagée.
        'react': resolve(dirname(require.resolve('react/package.json'))),
        'react-dom': resolve(dirname(require.resolve('react-dom/package.json'))),
        'react-dom/client': resolve(dirname(require.resolve('react-dom/package.json')), 'client.js'),
        'react/jsx-runtime': resolve(dirname(require.resolve('react/package.json')), 'jsx-runtime.js'),
        'react/jsx-dev-runtime': resolve(dirname(require.resolve('react/package.json')), 'jsx-dev-runtime.js'),
        // ─────────────────────────────────────────────────────────────────────────
        'lodash.debounce': 'lodash-es/debounce',
        'lodash.findlast': 'lodash-es/findLast',
        'lodash.isequal': 'lodash-es/isEqual',
        'lodash.omit': 'lodash-es/omit',
        'lodash.throttle': 'lodash-es/throttle',
        // ugly, stupid hack to support dynamic translation resolution here
        '@egen/esm-translations/translations': resolve(
          dirname(require.resolve('@egen/esm-translations/package.json')),
          'translations',
        ),
      },
    },
    plugins: [
      egenCleanBeforeBuild && new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: 'blocking',
        publicPath: egenPublicPath,
        template: resolve(__dirname, 'src/index.ejs'),
        templateParameters: {
          egenApiUrl,
          egenPublicPath,
          egenFavicon,
          egenPageTitle,
          egenDefaultLocale,
          egenImportmapDef,
          egenImportmapUrl,
          egenRoutesDef,
          egenRoutesUrl,
          egenOffline,
          egenEnvironment,
          egenConfigUrls,
          egenCoreImportmap: appPatterns.length > 0 && JSON.stringify(coreImportmap),
          egenCoreRoutes: Object.keys(coreRoutes).length > 0 && JSON.stringify(coreRoutes),
        },
      }),
      new HtmlWebpackTagsPlugin({ tags: egenJsCssAssets.map(fileName => 'assets/' + basename(fileName)) }),
      new WebpackPwaManifest({
        name: 'EGEN',
        short_name: 'EGEN',
        publicPath: egenPublicPath,
        description: 'Open source Health IT by and for the entire planet, starting with the developing world.',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: resolve(__dirname, 'src/assets/logo-512.png'),
            sizes: [96, 128, 144, 192, 256, 384, 512],
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: resolve(__dirname, 'src/assets') }, ...appPatterns, ...assetsPatterns],
      }),
      new ModuleFederationPlugin({
        name,
        remotes: {
          // Micro-frontend IAM — chargé dynamiquement en runtime
          iam: `iam@${process.env.IAM_REMOTE_URL || 'http://localhost:3001'}/remoteEntry.js`,
        },
        shared: sharedDependencies.reduce((obj, depName) => {
          // This just attempts to align the requiredVersion with what we usually have in peerDependencies
          let version = dependencies[depName];

          if (version) {
            if (version.startsWith('^')) {
              version = `${semver.parse(version.slice(1)).major}.x`;
            } else if (version.startsWith('~')) {
              const semVer = semver.parse(version.slice(1));
              version = `${semVer.major}.${semVer.minor}.x`;
            } else if (version === 'workspace:*') {
              version = `${semver.parse(require(`${depName}/package.json`).version).major}.X`;
            }
          }

          const eager = depName === 'dayjs';

          // react/jsx-runtime et react-dom/client ne sont pas des packages npm autonomes
          // Leur version est dérivée de react / react-dom
          if (depName === 'react/jsx-runtime') {
            const reactPkg = require('react/package.json');
            obj['react/jsx-runtime'] = {
              requiredVersion: `${semver.parse(reactPkg.version).major}.x`,
              strictVersion: false,
              singleton: true,
              eager: false,
              import: 'react/jsx-runtime',
              shareKey: 'react/jsx-runtime',
              shareScope: 'default',
              version: reactPkg.version,
            };
            return obj;
          }

          if (depName === 'react-dom/client') {
            const rdPkg = require('react-dom/package.json');
            obj['react-dom/client'] = {
              requiredVersion: `${semver.parse(rdPkg.version).major}.x`,
              strictVersion: false,
              singleton: true,
              eager: false,
              import: 'react-dom/client',
              shareKey: 'react-dom/client',
              shareScope: 'default',
              version: rdPkg.version,
            };
            return obj;
          }

          if (depName === 'swr') {
            // SWR is annoying with Module Federation
            // See: https://github.com/webpack/webpack/issues/16125 and https://github.com/vercel/swr/issues/2356
            obj['swr/_internal'] = {
              requiredVersion: version,
              strictVersion: false,
              singleton: true,
              eager: false,
              import: 'swr/_internal',
              shareKey: 'swr/_internal',
              shareScope: 'default',
              version: require('swr/package.json').version,
            };
          } else {
            obj[depName] = {
              requiredVersion: version ?? false,
              strictVersion: false,
              singleton: true,
              eager: eager,
              import: depName,
              shareKey: depName,
              shareScope: 'default',
            };
          }
          return obj;
        }, {}),
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: 'egen.[contenthash].css',
          ignoreOrder: true,
        }),
      new DefinePlugin({
        'process.env.BUILD_VERSION': JSON.stringify(`${version}-${timestamp}`),
        'process.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env?.analyze ? 'static' : 'disabled',
      }),
      egenOffline
        ? new InjectManifest({
            swSrc: resolve(__dirname, './src/service-worker/index.js'),
            swDest: 'service-worker.js',
            maximumFileSizeToCacheInBytes: mode === production ? undefined : Number.MAX_SAFE_INTEGER,
            additionalManifestEntries: [
              { url: egenImportmapUrl, revision: null },
              { url: egenRoutesUrl, revision: null },
            ],
          })
        : new InjectManifest({
            swSrc: resolve(__dirname, './src/service-worker/noop.js'),
            swDest: 'service-worker.js',
            // this is a no-op service worker, so we don't want to cache anything
            maximumFileSizeToCacheInBytes: 0,
            exclude: [/.*/],
          }),
    ].filter(Boolean),
    ignoreWarnings: [/.*InjectManifest has been called multiple times.*/],
  };
};