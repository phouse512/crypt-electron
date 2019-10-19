const path = require('path');
const webpack = require('webpack');

const paths = {
  DIST: path.resolve(__dirname, 'public'),
  SRC: path.resolve(__dirname, 'src'),
};

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'babel-polyfill', 
    path.join(paths.SRC, 'renderer/index.jsx'), 
  ],
  mode: 'development',
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js',
    publicPath: '/public/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DEBUG': JSON.stringify(true),
    }),
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
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      }
    ],
  },
  node: { __dirname: true },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'electron-renderer',
};
