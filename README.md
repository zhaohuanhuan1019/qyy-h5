# approval

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#工作日志
###2017-11-30版本
原来路由：
F : {
    "home":'审批',
    "allnotice":'公告',
    "clock":'考勤',
}
B : '/attend': {
        target: 'http://10.112.178.22', //  开发
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
    '/message':{ //通知消息
        target: 'http://10.112.178.22', //  开发
        changeOrigin: true,
        pathRewrite:{
            '^/message':'/message'
        }
    },
    '/api/': {
         target: 'http://localhost:3000',
         changeOrigin: true,
         pathRewrite: {
             '^/api/': ''
         }
     }
-------------------------------------------
修改路由：
F : {
    "page_approve":'审批',
    "page_notice":'公告',
    "page_attence":'考勤',
    "workNotify":'工作通知'
}
B : '/attend': {
        target: 'http://10.112.178.22', //  开发
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
    '/message':{ //通知消息
        target: 'http://10.112.178.22', //  开发
        changeOrigin: true,
        pathRewrite:{
            '^/message':'/message'
        }
    },
    '/api/': {
         target: 'http://localhost:3000',
         changeOrigin: true,
         pathRewrite: {
             '^/api/': ''
         }
     }
------------------------------------

# 添加子模块在src下新建文件夹
# router 配置所有模块的路径---vue-router
# store 模块化----vuex
# common 存放模块共用css  js
# static 中单个模块的image 分开存放
