const webpack = require('webpack');
const path = require('path');

module.exports = {
  // mode: 'development',
  mode: 'production',

  entry: './client/components/App.jsx',

  output: {
    libraryTarget: 'umd',
    filename: 'index.js',
    library: 'Admyn',
    path: path.resolve(__dirname, 'client')
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
        include: [path.resolve(__dirname, 'client/components')],
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  }
};
