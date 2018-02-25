const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { compact } = require('lodash');

module.exports = {
  entry: __dirname + '/index.js',
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
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  plugins: compact([
    process.env.NODE_ENV === 'production' ? new UglifyJSPlugin() : null,
    new CleanWebpackPlugin(['dist']),
    process.env.NODE_ENV === 'production' ? new BundleAnalyzerPlugin() : null,
  ]),
};
