/*eslint no-process-env:0, camelcase:0*/
'use strict';
const helpers = require('./helpers');

const path = require('path');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = (process.env.NODE_ENV || 'development') === 'production';
const basePath = 'dollar-street';
// const devtool = isProduction ? 'inline-source-map' : 'source-map';
const dest = 'dist';
const absDest = root(dest);

const config = {
  debug: false,
  verbose: true,
  displayErrorDetails: true,
  context: __dirname,
  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    cache: false,
    root: __dirname,
    extensions: ['', '.ts', '.js', '.json']
  },

  entry: {
    polyfills: './app/polyfills.ts',
    vendor: './app/vendor.ts',
    app: './app/boot.ts'
  },

  output: {
    path: absDest,
    filename: `${basePath}/[name].[hash].js`,
    sourceMapFilename: `${basePath}/[name].[hash].js.map`,
    chunkFilename: `${basePath}/[id].[hash].chunk.js`,
    publicPath: '/'
  },

  module: {
    loaders: [
      // support markdown
      {test: /\.md$/, loader: 'html?minimize=false!markdown'},
      // Support for *.json files.
      {test: /\.json$/, loader: 'json'},
      // Support for CSS as raw text
      {test: /\.css$/, loader: 'raw'},
      // support for .html as raw text
      {test: /\.html$/, loader: 'raw'},
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts',
        query: {
          compilerOptions: {
            removeComments: true,
            noEmitHelpers: false
          }
        },
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      }
    ],
    noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/,
      /zone\.js\/dist/
    ]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({name: helpers.reverse(['polyfills', 'vendor'])}),
    // static assets
    //new CopyWebpackPlugin([{from: 'demo/favicon.ico', to: 'favicon.ico'}]),
    new CopyWebpackPlugin([{from: 'app/assets', to: 'assets'}]),
    // generating html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      chunksSortMode: helpers.packageSort(['polyfills', 'vendor', 'app'])
    }),
    new webpack.DefinePlugin({ENV: JSON.stringify(process.env.NODE_ENV || 'development')})
  ],
  devServer: {
    contentBase: path.join(`${dest}/${basePath}`),
    publicPath: '/',
    noInfo: true,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    devtool: 'eval'
  }
};

function pushPlugins(conf) {
  if (!isProduction) {
    return;
  }

  conf.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: false,
      comments: false,
      compress: {screw_ie8: true}
    }),
    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html|\.css|.map$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

pushPlugins(config);

module.exports = config;

function root(location) {
  return path.join(__dirname, location);
}
