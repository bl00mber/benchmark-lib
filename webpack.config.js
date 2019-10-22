const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TARGET = process.env.TARGET;
const ROOT_PATH = path.resolve(__dirname);
const nodeModulesDir = path.join(ROOT_PATH, 'node_modules');

const common = {
  entry: path.resolve(ROOT_PATH, 'src/index.js'),
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  output: {
    path: path.resolve(ROOT_PATH, 'dist'),
    filename: 'lib.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.resolve(ROOT_PATH, 'src')
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'url-loader?limit=100000',
            'img-loader'
          ],
        exclude: /node_modules/
      }
    ]
  }
}

if (TARGET === 'dev') {
  module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      publicPath: 'http://localhost:3000/dist/',
      port: '3000',
      host: '0.0.0.0',
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      contentBase: ['dist', 'test/index']
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader'
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        },
        __DEV__: true
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    mode: 'production',
    entry: {
      'benchmark-lib': path.resolve(ROOT_PATH, 'src/index.js')
    },
    optimization: {},
    output: {
      path: path.resolve(ROOT_PATH, 'dist'),
      filename: 'lib.js',
      library: 'BenchmarkLib',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        },
        __DEV__: false
      }),
      new MiniCssExtractPlugin({
        filename: "style.css",
        chunkFilename: "[id].css"
      })
    ]
  });
}
