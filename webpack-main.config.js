const path = require('path');
const webpack = require('webpack');

const paths = {
  DIST: path.resolve(__dirname, 'public'),
  SRC: path.resolve(__dirname, 'src'),
};

module.exports = {
  entry: [
    'babel-polyfill', 
    path.join(paths.SRC, 'main/main.js'), 
  ],
  externals: [
    function(context, request, callback) {
      if (request.match(/devtron/)) {
        return callback(null, 'commonjs ' + request);
      }

      callback();
    },
  ],
  output: {
    path: paths.DIST,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'electron-main',
  node: {
    __dirname: false,
  },
};
