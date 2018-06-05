// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../approvaldist/index.html'),
        assetsRoot: path.resolve(__dirname, '../approvaldist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false, // 生产环境
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/attend': {
                target: 'http://10.112.178.22', //  开发
                // target: 'http://10.69.58.1:9005', //  开发

                // target: 'http://10.69.205.36:9005',
                changeOrigin: true,
                pathRewrite: {
                    '^/attend': '/attend'
                }
            },
            '/v1': {
                target: 'http://10.112.178.22', //  开发
                changeOrigin: true,
                pathRewrite: {
                    '^/v1': '/v1'
                }
            },
            '/approve': {
                target: 'http://10.112.178.22', //  开发
                changeOrigin: true,
                pathRewrite: {
                    '^/approve': '/approve'
                }
            },
            '/notice': {//公告
                target: 'http://10.112.178.22', //  开发
                changeOrigin: true,
                pathRewrite:{
                    '^/notice':'/notice'
                }
            },
            '/appstore':{//应用开关
                target: 'http://10.112.178.22', //  开发
                changeOrigin: true,
                pathRewrite:{
                    '^/appstore':'/appstore'
                }
            },
            '/message':{ //通知消息
                target: 'http://10.112.178.22', //  开发
                changeOrigin: true,
                pathRewrite:{
                    '^/message':'/message'
                }
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
