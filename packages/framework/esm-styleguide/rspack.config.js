const { rspack } = require('@rspack/core');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('node:path');

const { peerDependencies } = require('./package.json');

module.exports = (env, argv = {}) => ({
  entry: [resolve(__dirname, 'src/internal.ts'), resolve(__dirname, 'src/_all.scss')],
  output: {
    filename: 'egen-esm-styleguide.js',
    chunkFilename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  mode: argv.mode ?? process.env.NODE_ENV ?? 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{ loader: rspack.CssExtractRspackPlugin.loader }, 'css-loader', 'builtin:lightningcss-loader'],
      },
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
        // Fix: options doit être DANS l'objet use, pas au niveau de la règle
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
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
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  watch: false,
  externalsType: 'module',
  externals: [...Object.keys(peerDependencies || {})],
  resolve: {
    // extensionAlias : résout les imports TypeScript ESM avec extension .js
    // explicite vers les fichiers .ts/.tsx réels sur le disque.
    // Exemple: './breakpoints/index.js' → './breakpoints/index.ts'
    // Solution officielle rspack pour TypeScript + ESM (moduleResolution: node16/bundler)
    // Ref: https://rspack.rs/config/resolve#resolveextensionalias
    extensionAlias: {
      '.js':  ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    },
    alias: {
      // Résout les imports @/ vers src/ (shadcn/ui style)
      '@': resolve(__dirname, 'src'),
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
      filename: 'egen-esm-styleguide.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? 'static' : 'disabled',
    }),
  ],
});
