const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const meteorExternals = require('webpack-meteor-externals');
const nodeExternals = require('webpack-node-externals');

const clientConfig = {
  entry: './startup/client/main.jsx',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        },
        loader: 'babel-loader'
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx', '.json', '.gql', '.graphql']
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './startup/client/main.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  externals: [meteorExternals()],
  devServer: {
    contentBase: './dist',
    hot: true,
    hmr: true
  },
  stats: {
    errorDetails: false
  }
};

const serverConfig = {
  entry: ['./startup/server/index.js'],
  target: 'node',
  devServer: {
    hot: 'only'
  },
  externals: [meteorExternals(), nodeExternals({ modulesDir: path.resolve(__dirname, 'node_modules') })]
};

module.exports = [clientConfig, serverConfig];
