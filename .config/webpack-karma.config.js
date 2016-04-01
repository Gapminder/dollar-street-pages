const path = require('path');
const cwd = process.cwd();
console.log(path.resolve(cwd))
module.exports = {
  resolve: {
    root: [path.resolve(cwd)],
    modulesDirectories: ['node_modules', 'test', 'app','.'],
    extensions: ['', '.ts' ,'.js', '.css'],
    alias: {
      'test': 'test'
    }
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
       // exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      }
    ],
    postLoaders: [

      // Instruments JS files with Istanbul for subsequent code coverage reporting.
      // Instrument only testing sources.
      //
      // See: https://github.com/deepsweet/istanbul-instrumenter-loader
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: path.resolve(cwd)+'/app',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }

    ],
    noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/
    ]
  },
  stats: {
    colors: true,
    reasons: true
  },
  watch: true,
  debug: true
}
