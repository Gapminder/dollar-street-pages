'use strict';
const path = require('path');
const cwd = process.cwd();

module.exports = {
  resolve: {
    root: [path.resolve(cwd)],
    modulesDirectories: ['node_modules'],
    extensions: ['', '.ts', '.js', '.css']
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules/]}
    ],
    postLoaders: [
      // instrument only testing sources with Istanbul
      {
        test: /\.(js|ts)$/,
        include: root('../app'),
        loader: 'istanbul-instrumenter-loader',
        exclude: [
          /\.e2e\.ts$/,
          /node_modules/
        ]
      }
    ],
    noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/,
      /zone\.js\/dist/
    ]
  },
  stats: {
    colors: true,
    reasons: true
  },
  watch: false,
  debug: false
};

function root(p) {
  return path.join(__dirname, p);
}
