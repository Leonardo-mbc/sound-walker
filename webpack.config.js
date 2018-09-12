const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_DEBUG = process.env.production !== 'true';
console.log('IS_DEBUG', IS_DEBUG);

const DEBUG_PLUGINS = [
  new HtmlWebpackPlugin({
    title: '[debug] Sound Walker - .miximum',
    filename: 'index.html',
    template: './src/assets/index.template.html'
  })
];
const PUBLISH_PLUGINS = [
  new ExtractTextPlugin('style.css'),
  new HtmlWebpackPlugin({
    title: 'Sound Walker - .miximum',
    filename: 'index.html',
    template: './src/assets/index.template.html',
    minify: {
      collapseWhitespace: true
    }
  })
];

const DEBUG_CSS_RULE = {
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        localIdentName: '[path][name]__[local]--[hash:base64:5]',
        importLoaders: 1,
        camelCase: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    }
  ]
};
const PUBLISH_CSS_RULE = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1,
          camelCase: true
        }
      },
      'postcss-loader'
    ]
  })
};

module.exports = {
  mode: IS_DEBUG ? 'development' : 'production',
  entry: [
    './src/index.tsx',
    './src/assets/styles/global.css'
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    alias: {
      "widget:styles": path.join(__dirname, "src", "styles")
    }
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    port: 3000,
    host: '0.0.0.0'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: "awesome-typescript-loader"
    }, {
      enforce: "pre",
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "source-map-loader"
    }, {
      test: /\.(png|jpg|gif|otf|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {}
      }]
    }, {
      ...(IS_DEBUG ? DEBUG_CSS_RULE : PUBLISH_CSS_RULE)
    }]
  },
  plugins: [
    ...(IS_DEBUG ? DEBUG_PLUGINS : PUBLISH_PLUGINS)
  ]
};
