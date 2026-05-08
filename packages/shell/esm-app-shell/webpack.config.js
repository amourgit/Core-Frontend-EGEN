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

const eigenAddCookie = process.env.IGEN_ADD_COOKIE;
const eigenApiUrl = removeTrailingSlash(process.env.IGEN_API_URL || '/eigen');
const eigenPublicPath = removeTrailingSlash(process.env.IGEN_PUBLIC_PATH || '/eigen/spa');
const eigenProxyTarget = process.env.IGEN_PROXY_TARGET || 'https://dev.iam-central.ga/';
const eigenPageTitle = process.env.IGEN_PAGE_TITLE || 'EIGEN';
const eigenFavicon = process.env.IGEN_FAVICON || `${eigenPublicPath}/favicon.ico`;
const eigenEnvironment = process.env.IGEN_ENV || process.env.NODE_ENV || '';
const eigenOffline = process.env.IGEN_OFFLINE === 'enable';
const eigenDefaultLocale = process.env.IGEN_DEFAULT_LOCALE || 'en';
const eigenImportmapDef = process.env.IGEN_IMPORTMAP;
const eigenImportmapUrl = process.env.IGEN_IMPORTMAP_URL || `${eigenPublicPath}/importmap.json`;
const eigenRoutesDef = process.env.IGEN_ROUTES;
const eigenRoutesUrl = process.env.IGEN_ROUTES_URL || `${eigenPublicPath}/routes.registry.json`;
const eigenCoreApps = process.env.IGEN_CORE_APPS_DIR || resolve(__dirname, '../../apps');
const eigenConfigUrls = (process.env.IGEN_CONFIG_URLS || '')
  .split(';')
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(', ');
const eigenJsCssAssets = (process.env.IGEN_JS_CSS_ASSETS || '')
  .split(';')
  .filter((filePath) => filePath.length > 0);

const eigenCleanBeforeBuild =
  (() => {
    try {
      return (
        process.env.OMRS_CLEAN_BEFORE_BUILD === undefined ||
        (typeof process.env.OMRS_CLEAN_BEFORE_BUILD === 'boolean' && process.env.OMRS_CLEAN_BEFORE_BUILD) ||
        (typeof process.env.OMRS_CLEAN_BEFORE_BUILD === 'string' &&
          process.env.OMRS_CLEAN_BEFORE_BUILD.toLowerCase() !== 'false')
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

  if (!isProd && checkDirectoryExists(eigenCoreApps)) {
    readdirSync(eigenCoreApps).forEach((dir) => {
      const appDir = resolve(eigenCoreApps, dir);
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

  const assetsPatterns = eigenJsCssAssets.map(asset => ({from: asset, to: 'assets'}));

  return {
    entry: resolve(__dirname, 'src/index.ts'),
    output: {
      filename: isProd ? 'eigen.[contenthash].js' : 'eigen.js',
      chunkFilename: '[chunkhash].js',
      path: resolve(__dirname, outDir),
      publicPath: '',
      hashFunction: 'xxhash64',
    },
    target: 'web',
    devServer: {
      compress: true,
      open: [`${eigenPublicPath}/`.substring(1)],
      devMiddleware: {
        publicPath: `${eigenPublicPath}/`,
      },
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^${escapeRegExp(eigenPublicPath)}/.*(?!\\.(?!html).+$)`),
            to: `${eigenPublicPath}/index.html`,
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

            if (path.startsWith(eigenPublicPath)) {
              if (basename(path).indexOf('.') >= 0) {
                return true;
              } else {
                return false;
              }
            }

            if (path.startsWith(eigenApiUrl)) {
              return true;
            }

            return false;
          },
          target: eigenProxyTarget,
          changeOrigin: true,
          /**
           * @param {Request} proxyReq
           */
          onProxyReq(proxyReq) {
            if (eigenAddCookie) {
              const origCookie = proxyReq.getHeader('cookie');
              const newCookie = `${origCookie};${eigenAddCookie}`;
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
            if (path.startsWith(eigenPublicPath)) {
              const matcher = /^.*\/([^\/]*\.(?!html|js)[^.]+)$/i.exec(path);
              if (matcher) {
                return `${eigenPublicPath}/${matcher[1]}`;
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
          test: /eigen-esm-styleguide.css$/,
          use: [
            isProd
              ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.css$/,
          exclude: [/eigen-esm-styleguide.css$/],
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
      eigenCleanBeforeBuild && new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: 'blocking',
        publicPath: eigenPublicPath,
        template: resolve(__dirname, 'src/index.ejs'),
        templateParameters: {
          eigenApiUrl,
          eigenPublicPath,
          eigenFavicon,
          eigenPageTitle,
          eigenDefaultLocale,
          eigenImportmapDef,
          eigenImportmapUrl,
          eigenRoutesDef,
          eigenRoutesUrl,
          eigenOffline,
          eigenEnvironment,
          eigenConfigUrls,
          eigenCoreImportmap: appPatterns.length > 0 && JSON.stringify(coreImportmap),
          eigenCoreRoutes: Object.keys(coreRoutes).length > 0 && JSON.stringify(coreRoutes),
        },
      }),
      new HtmlWebpackTagsPlugin({ tags: eigenJsCssAssets.map(fileName => 'assets/' + basename(fileName)) }),
      new WebpackPwaManifest({
        name: 'EIGEN',
        short_name: 'EIGEN',
        publicPath: eigenPublicPath,
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
          filename: 'eigen.[contenthash].css',
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
      eigenOffline
        ? new InjectManifest({
            swSrc: resolve(__dirname, './src/service-worker/index.ts'),
            swDest: 'service-worker.js',
            maximumFileSizeToCacheInBytes: mode === production ? undefined : Number.MAX_SAFE_INTEGER,
            additionalManifestEntries: [
              { url: eigenImportmapUrl, revision: null },
              { url: eigenRoutesUrl, revision: null },
            ],
          })
        : new InjectManifest({
            swSrc: resolve(__dirname, './src/service-worker/noop.ts'),
            swDest: 'service-worker.js',
            // this is a no-op service worker, so we don't want to cache anything
            maximumFileSizeToCacheInBytes: 0,
            exclude: [/.*/],
          }),
    ].filter(Boolean),
    ignoreWarnings: [/.*InjectManifest has been called multiple times.*/],
  };
};
