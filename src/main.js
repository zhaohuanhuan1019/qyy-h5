// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios'  //用来在vuex文件中请求接口
import store from '../store/index';
import FastClick from 'fastclick';
import App from './App';
import routes from '../router/router';
import '../static/js/rem';
import '../static/css/reset.css';
import Mint from 'mint-ui';
import VueBus from 'vue-bus';
import AMap from 'vue-amap';
import noPermission from 'common/components/noPermission';  // 没有权限弹层
//    import $ from 'jquery';



// android
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

connectWebViewJavascriptBridge(function(bridge) {
    initVueApp();
    bridge.init(function(message, responseCallback) {
        console.log('JS got a message', message);
        var data = {
            'Javascript Responds': '测试中文!'
        };
        console.log('JS responding with', data);
        responseCallback(data);
    });
});
// ios
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}
setupWebViewJavascriptBridge(function (bridge) {
        initVueApp();
});

FastClick.attach(document.body);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Mint);
Vue.use(AMap);
Vue.use(VueBus);
Vue.component('no-Permission', noPermission);//全局注册权限弹窗组件
/*统一的对接口返回code进行拦截--start*/
    /*VueResource的http响应拦截器 */
    Vue.http.interceptors.push(function(request, next) {
      next(function(response) {
        if(response.body.code== 12012){
            store.dispatch('change_isShowNoPermissionAction',true);
        }
      });
    });
    /*axios的http响应拦截器 */
    axios.interceptors.response.use(
        response => {
            if(response.data.code == 12012){
                store.dispatch('change_isShowNoPermissionAction',true);
            }
            return response;
        },
        error => {
            return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        }
    );
/*统一的对接口返回code进行拦截--end*/

// 初始化vue-amap
AMap.initAMapApiLoader({
    // 高德的key
    key: '56c0109c48915b757b465889b9b19c3d',
    // 插件集合
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

Vue.http.options.credentials = true;
Vue.http.options.emulateJSON = true;
// Vue.http.options.emulateHTTP = true;


const router = new VueRouter({
    mode: 'history',  // 路由使用history模式
    routes,
    linkActiveClass: 'active',  // 设置当前路由的className
    scrollBehavior (to, from, savedPosition) {
        //console.log('savedPosition======',savedPosition)
         if (savedPosition) {
            return savedPosition
          } else {
            return { x: 0, y: 0 }
          }
        // const toPath = to.path;
        // const fromPath = from.path;
        // if(toPath == '/allnotice' && fromPath == '/allnotice'){
        //     console.log(1)
        //     const posY = localStorage.getItem("allPosY");
        //     if(posY !== 0){
        //         document.body.scrollTop = posY;
        //         document.documentElement.scrollTop = posY;
        //     }
        // } else if(toPath == '/notice/collection' && fromPath == '/notice/collection'){
        //      console.log(2)
        //     const posY = localStorage.getItem("collPosY");
        //     if(posY !== 0){
        //         document.body.scrollTop = posY;
        //         document.documentElement.scrollTop = posY;
        //     }
        // }else if(toPath == '/notice/collection' && fromPath == '/allnotice'){
        //      console.log(3)
        //     const posY = localStorage.getItem("collPosY");
        //     if(posY !== 0){
        //         document.body.scrollTop = posY;
        //         document.documentElement.scrollTop = posY;
        //     }
        // }
    }
});

/* eslint-disable no-new */

function initVueApp() {
    new Vue({
        el: '#app',
        router,
        store,
        components: {
            App
        },
        data () {
            return {
                listData: []
            };
        }
    }).$mount('#app');
}

