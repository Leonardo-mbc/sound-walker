const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const IS_DEBUG = process.env.production !== 'true';
console.log('IS_DEBUG', IS_DEBUG);

const cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      url: false,
      sourceMap: true,
      importLoaders: 1,
      esModule: true,
      modules: {
        mode: 'global',
        namedExport: true,
        exportLocalsConvention: 'camelCaseOnly',
        localIdentName: IS_DEBUG
          ? '[path][name]__[local]--[hash:base64:5]'
          : '[hash:base64:8]',
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
    },
  },
];

const plugins = [
  new webpack.DefinePlugin({
    IS_DEBUG,
  }),
  new HtmlWebpackPlugin({
    title: IS_DEBUG ? '[debug] Sound Walker' : 'Sound Walker',
    filename: 'index.html',
    template: './src/assets/index.template.html',
    isDebug: IS_DEBUG,
    minify: IS_DEBUG
      ? false
      : {
          collapseWhitespace: true,
        },
  }),
];

if (!IS_DEBUG) {
  plugins.push(
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new GenerateSW({
      skipWaiting: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      runtimeCaching: [
        {
          urlPattern: /assets\/images/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
        {
          urlPattern: /assets\/sounds/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'sounds',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: /musics/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'musics',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    })
  );
}

module.exports = {
  mode: IS_DEBUG ? 'development' : 'production',
  entry: ['./src/index.tsx', './src/assets/styles/global.css'],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true,
    hot: true,
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          IS_DEBUG ? 'style-loader' : MiniCssExtractPlugin.loader,
          ...cssLoaders,
        ],
      },
    ],
  },
  plugins,
};
