const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public')
};

module.exports = {
  entry: `${PATHS.src}/Root.js`,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.template.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: PATHS.build,
    inline: true,
    port: 4000
  },
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        include: `${PATHS.src}/assets`
      }
    ]
  }
}
