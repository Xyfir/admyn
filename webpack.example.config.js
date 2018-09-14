const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',

  entry: './example/Client.jsx',

  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'example/static')
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'client/components'),
          path.resolve(__dirname, 'example')
        ],
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  }
};
