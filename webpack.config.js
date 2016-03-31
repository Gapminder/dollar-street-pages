/*eslint no-process-env:0, camelcase:0*/
'use strict';

const path = require('path');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin')
const isProduction = (process.env.NODE_ENV || 'development') === 'production';
const devtool = process.env.NODE_ENV !== 'test' ? 'source-map' : 'inline-source-map';
const dest = 'dist';
const absDest = root(dest);

const config = {
  devtool: devtool,
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
    angular2: [
      'angular2/bundles/angular2-polyfills',
      'rxjs',
      'es6-shim',
      'angular2/platform/browser',
      'angular2/common',
      'angular2/core'
    ],
    app: 'app'
  },

  output: {
    path: absDest,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  // our Development Server configs
  /*devServer: {
   inline: true,
   colors: true,
   historyApiFallback: true,
   contentBase: dest,
   //publicPath: dest,
   watchOptions: {aggregateTimeout: 300, poll: 1000}
   },*/
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
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'angular2',
      minChunks: Infinity,
      filename: 'angular2.js'
    }),
    // static assets
    //new CopyWebpackPlugin([{from: 'demo/favicon.ico', to: 'favicon.ico'}]),
    //new CopyWebpackPlugin([{from: 'demo/assets', to: 'assets'}]),
    // generating html
    new HtmlWebpackPlugin({template: 'app/index.html'})
  ]
};

function pushPlugins(conf) {
  if (!isProduction) {
    return;
  }

  conf.plugins.push.apply(conf.plugins, [
    //production only
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: false,
      comments: false,
      compress: {
        screw_ie8: true
        //warnings: false,
        //drop_debugger: false
      }
      //verbose: true,
      //beautify: false,
      //quote_style: 3
    }),
    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.html|\.css|.map$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]);
}

pushPlugins(config);

module.exports = config;

function root(p) {
  return path.join(__dirname, p);
}
