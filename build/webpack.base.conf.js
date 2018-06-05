var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
/*var webpack = require("webpack")*/

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '@': resolve('src'),
        'approve': resolve('src/approve'),
        'attence': resolve('src/attence'),
        'common': resolve('src/common'),
        'notice': resolve('src/notice'),
        'store':path.resolve(__dirname, '../store'),//增加这一行代码
        'notifyRemain': resolve('src/notify_remain')
    }
  },
  module: {
    rules: [
        // {
        //     test: /\.(js|vue)$/,
        //     loader: 'eslint-loader',
        //     enforce: "pre",
        //     include: [resolve('src'), resolve('test')],
        //     options: {
        //         formatter: require('eslint-friendly-formatter')
        //     }
        // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('static'), resolve('store'), resolve('router')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 50000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // plugins: [
  //     new webpack.optimize.CommonsChunkPlugin('common.js'),
  //     new webpack.ProvidePlugin({
  //         jQuery: "jquery",
  //         $: "jquery"
  //     })
  // ],
  externals: {
      'AMap': 'window.AMap'
  }
}
