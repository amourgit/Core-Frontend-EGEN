const { rspack } = require('@rspack/core');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('node:path');

const { peerDependencies } = require('./package.json');

module.exports = (env, argv = {}) => ({
  entry: [resolve(__dirname, 'src/internal.ts')],
  output: {
    filename: 'egen-esm-framework.js',
    chunkFilename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  mode: argv.mode ?? process.env.NODE_ENV ?? 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: rspack.CssExtractRspackPlugin.loader },
          'css-loader',
          'builtin:lightningcss-loader',
          {
            loader: require.resolve('sass-loader'),
            options: {
              api: 'modern-compiler',
              implementation: require.resolve('sass-embedded'),
              sassOptions: { quietDeps: true },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
      {
        test: /\.(woff|woff2|png)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: 'svgo-loader',
        type: 'asset/source',
      },
      {
        test: /\.html$/,
        type: 'asset/source',
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  watch: false,
  externalsType: 'module',
  externals: [
    ...Object.keys(peerDependencies || {}),
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-dom/client',
    'react-dom/server',
  ],
  resolve: {
    // extensionAlias: résout les imports TypeScript ESM (.js → .ts/.tsx)
    // Solution long terme — couvre tous les fichiers présents et futurs
    extensionAlias: {
      '.js':  ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    },
    alias: {
      '@/components': resolve(__dirname, '../esm-styleguide/src'),
      '@': resolve(__dirname, '../esm-styleguide/src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new rspack.CssExtractRspackPlugin({
      filename: 'egen-esm-framework.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? 'static' : 'disabled',
    }),
  ],
});
