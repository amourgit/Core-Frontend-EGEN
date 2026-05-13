"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizationConfig = exports.watchConfig = exports.assetRuleConfig = exports.scssRuleConfig = exports.cssRuleConfig = exports.scriptRuleConfig = exports.additionalConfig = exports.overrides = void 0;
/**
 * This is the base webpack config for all EGEN modules.
 *
 * ## Usage
 *
 * You can use it as simply as
 *
 * ```ts
 * module.exports = require('egen/default-webpack-config');
 * ```
 *
 * or you can customize the configuration using merges and overrides
 * like
 *
 * ```ts
 * const config = require('egen/default-webpack-config');
 * config.cssRuleConfig.rules = [myCustomRule];
 * module.exports = config;
 * ```
 *
 * ## Development
 *
 * Advice for working on this file:
 *
 * Don't use `yarn link` or symlinks to work on it.
 *
 * After you `yarn build --watch`, do something like
 * `watch "cp -R dist /path/to/packages/esm-patient-chart-app/webpack"`
 * and then change the webpack line from
 * `module.exports = require('egen/default-webpack-config');`
 * to
 * `module.exports = require('./webpack');`
 *
 * This is because Webpack has unpredictable behavior when working with
 * symlinked files, **even when using absolute paths**. You read that right.
 * Telling Webpack to use `/a/b/c`? If the Webpack config is symlinked
 * from `/d/e/`, then it *might* in *some cases* try to import `/d/e/c`.
 */
const fs_1 = require("fs");
const path_1 = require("path");
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const ts_checker_rspack_plugin_1 = require("ts-checker-rspack-plugin");
// eslint-disable-next-line no-restricted-imports
const lodash_1 = require("lodash");
const semver_1 = require("semver");
const core_1 = __importStar(require("@rspack/core"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_stats_plugin_1 = require("webpack-stats-plugin");
const production = 'production';
const { ModuleFederationPlugin } = core_1.container;
function getFrameworkVersion() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { version } = require('@egen/esm-framework/package.json');
        return `^${version}`;
    }
    catch (_a) {
        return '5.x';
    }
}
function makeIdent(name) {
    if (name.includes('/')) {
        name = name.slice(name.indexOf('/'));
    }
    if (name.endsWith('-app')) {
        name = name.slice(0, -4);
    }
    return name;
}
function mergeFunction(objValue, srcValue) {
    if ((0, lodash_1.isArray)(objValue)) {
        return objValue.concat(srcValue);
    }
}
function slugify(name) {
    return name.replace(/[\/\-@]/g, '_');
}
function fileExistsSync(name) {
    return (0, fs_1.existsSync)(name) && (0, fs_1.statSync)(name).isFile();
}
/**
 * This object will be merged into the webpack config.
 * Array values will be concatenated with the existing array.
 * Make sure to modify this object and not reassign it.
 */
exports.overrides = {};
/**
 * The keys of this object will override the top-level keys
 * of the webpack config.
 * Make sure to modify this object and not reassign it.
 */
exports.additionalConfig = {};
/**
 * This object will be merged into the webpack rule governing
 * the loading of JS, JSX, TS, etc. files.
 * Make sure to modify this object and not reassign it.
 */
exports.scriptRuleConfig = {};
/**
 * This object will be merged into the webpack rule governing
 * the loading of CSS files.
 * Make sure to modify this object and not reassign it.
 */
exports.cssRuleConfig = {};
/**
 * This object will be merged into the webpack rule governing
 * the loading of SCSS files.
 * Make sure to modify this object and not reassign it.
 */
exports.scssRuleConfig = {};
/**
 * This object will be merged into the webpack rule governing
 * the loading of static asset files.
 * Make sure to modify this object and not reassign it.
 */
exports.assetRuleConfig = {};
/**
 * This object will be merged into the webpack rule governing
 * the watch options.
 * Make sure to modify this object and not reassign it.
 */
exports.watchConfig = {};
/**
 * This object will be merged with the webpack optimization
 * object.
 * Make sure to modify this object and not reassign it.
 */
exports.optimizationConfig = {};
exports.default = (env, argv = {}) => {
    const root = process.cwd();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { name, version, peerDependencies, browser, main, types } = require((0, path_1.resolve)(root, 'package.json'));
    // this typing is provably incorrect, but actually works
    const mode = (argv.mode || process.env.NODE_ENV || 'development');
    const filename = (0, path_1.basename)(browser || main);
    const outDir = (0, path_1.dirname)(browser || main);
    const srcFile = (0, path_1.resolve)(root, browser ? main : types);
    const ident = makeIdent(name);
    const frameworkVersion = getFrameworkVersion();
    const routes = (0, path_1.resolve)(root, 'src', 'routes.json');
    const hasRoutesDefined = fileExistsSync(routes);
    if (!hasRoutesDefined) {
        console.error('This app does not define a routes.json. This file is required for this app to be used by the EGEN App Shell.');
        // key-smash error code
        // so this (hopefully) doesn't interfere with Webpack-specific exit codes
        process.exit(9819023573289);
    }
    const cssLoader = {
        loader: require.resolve('css-loader'),
        options: {
            modules: {
                localIdentName: `${ident}__[name]__[local]___[hash:base64:5]`,
            },
        },
    };
    const baseConfig = Object.assign({ 
        // The only `entry` in the application is the app shell. Everything else is
        // a Webpack Module Federation "remote." This ensures that there is always
        // only one container context--i.e., if we had an entry point per module,
        // WMF could get confused and not resolve shared dependencies correctly.
        output: {
            publicPath: 'auto',
            path: (0, path_1.resolve)(root, outDir),
            hashFunction: 'xxhash64',
        }, module: {
            rules: [
                (0, lodash_1.merge)({
                    test: /\.m?(js|ts|tsx)$/,
                    exclude: /node_modules(?![\/\\]@egen)/,
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                        },
                    },
                }, exports.scriptRuleConfig),
                (0, lodash_1.merge)({
                    test: /\.css$/,
                    use: [require.resolve('style-loader'), cssLoader],
                }, exports.cssRuleConfig),
                (0, lodash_1.merge)({
                    test: /\.s[ac]ss$/i,
                    use: [
                        require.resolve('style-loader'),
                        cssLoader,
                        {
                            loader: require.resolve('sass-loader'),
                            options: {
                                api: 'modern-compiler',
                                implementation: require.resolve('sass-embedded'),
                                sassOptions: { quietDeps: true },
                            },
                        },
                    ],
                }, exports.scssRuleConfig),
                (0, lodash_1.merge)({
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                }, exports.assetRuleConfig),
            ],
        }, mode, devtool: mode === production ? 'hidden-nosources-source-map' : 'source-map', devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            devMiddleware: {
                writeToDisk: true,
            },
            static: [(0, path_1.resolve)(root, outDir)],
        }, watchOptions: (0, lodash_1.merge)({
            ignored: ['.git', 'test-results'],
        }, exports.watchConfig), performance: {
            hints: mode === production && 'warning',
        }, optimization: (0, lodash_1.merge)({
            // The defaults for both of these are 30; however, due to the modular nature of
            // the frontend, we want each app to produce substantially
            splitChunks: {
                maxAsyncRequests: 3,
                maxInitialRequests: 1,
            },
            minimizer: [new core_1.default.SwcJsMinimizerRspackPlugin(), new core_1.default.LightningCssMinimizerRspackPlugin()],
        }, exports.optimizationConfig), plugins: [
            new ts_checker_rspack_plugin_1.TsCheckerRspackPlugin(),
            new clean_webpack_plugin_1.CleanWebpackPlugin(),
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: env && env.analyze ? 'server' : 'disabled',
            }),
            new core_1.DefinePlugin({
                'process.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
            }),
            new ModuleFederationPlugin({
                // Look in the `esm-dynamic-loading` framework package for an explanation of how modules
                // get loaded into the application.
                name,
                library: { type: 'var', name: slugify(name) },
                filename,
                exposes: {
                    './start': srcFile,
                },
                shared: [...Object.keys(peerDependencies), '@egen/esm-framework/src/internal'].reduce((obj, depName) => {
                    var _a, _b;
                    if (depName === 'swr') {
                        // SWR is annoying with Module Federation
                        // See: https://github.com/webpack/webpack/issues/16125 and https://github.com/vercel/swr/issues/2356
                        obj['swr/'] = {
                            requiredVersion: (_a = peerDependencies['swr']) !== null && _a !== void 0 ? _a : false,
                            strictVersion: false,
                            singleton: true,
                            import: 'swr/',
                            shareKey: 'swr/',
                            shareScope: 'default',
                            // eslint-disable-next-line @typescript-eslint/no-require-imports
                            version: require('swr/package.json').version,
                        };
                    }
                    else {
                        obj[depName] = {
                            requiredVersion: (_b = peerDependencies[depName]) !== null && _b !== void 0 ? _b : false,
                            strictVersion: false,
                            singleton: true,
                            import: depName,
                            shareKey: depName,
                            shareScope: 'default',
                        };
                    }
                    return obj;
                }, {}),
            }),
            hasRoutesDefined &&
                new core_1.CopyRspackPlugin({
                    patterns: [
                        {
                            from: routes,
                            transform: {
                                transformer: (content) => JSON.stringify(Object.assign({}, JSON.parse(content.toString()), {
                                    version: mode === production ? version : (0, semver_1.inc)(version, 'prerelease', 'local'),
                                })),
                            },
                        },
                    ],
                }),
            new webpack_stats_plugin_1.StatsWriterPlugin({
                filename: `${filename}.buildmanifest.json`,
                stats: {
                    all: false,
                    chunks: true,
                },
            }),
        ].filter(Boolean), resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.json'],
            // extensionAlias: resout les imports TypeScript ESM (.js) vers .ts/.tsx
            // Solution long-terme: un seul endroit, couvre tout le monorepo sans toucher les sources
            extensionAlias: { '.js': ['.ts', '.tsx', '.js'], '.jsx': ['.tsx', '.jsx'], '.mjs': ['.mts', '.mjs'] },
            alias: {
                '@egen/esm-framework': '@egen/esm-framework/src/internal',
                'lodash.debounce': 'lodash-es/debounce',
                'lodash.findlast': 'lodash-es/findLast',
                'lodash.omit': 'lodash-es/omit',
                'lodash.throttle': 'lodash-es/throttle',
            },
        } }, exports.overrides);
    return (0, lodash_1.mergeWith)(baseConfig, exports.additionalConfig, mergeFunction);
};
