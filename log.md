=======================================================================================================================
# 审批
# 1、在用jsbridge与客户端进行数据交互的时候  注意ios不识别null
# 2、批量选择实现：
#    (1) 使用input标签实现v-model绑定一个数组，数组中存选中项的id
#    （2）其它标签在点击事件中处理存入要绑定的数组中的id
#        控制样式：
#        this.checkedLists.indexOf(id)> -1 判断选中样式得类
#        存选中id:
#        点击每一项时 更新数组里面的值：
#        if (this.checkedLists.indexOf(index) > -1) {
#                    this.checkedLists.splice(this.checkedLists.indexOf(index), 1);
#                } else {
#                    this.checkedLists.push(index);
#                }
# 3、关于提交类型的按钮，要做好重复点击提交处理
# 4、多个tab键点击时请求到的数据 渲染同一个列表组件， 快速点击会出现前面点击返回的数据覆盖最后一次点击的数据，因为把获取的数据放到了同一个数组变量中，
#   修改后 使用不同变量存储 不同tab键请求到的数据，
#   但是当tab键有很多个，这种解决办法不太合适
# 5、touchstart touchmove touchend 实现左滑事件  在android低版本不兼容：
#   if (X - x > 10) {   // 右滑
#         event.preventDefault();
#      }
#   if (x - X > 10) {   // 左滑
#         event.preventDefault();
#      }
#   判断滑动距离 阻止默认事件 直接阻止默认事件会禁止掉列表的scroll
# 6、border-radius 实现圆圈 在不同手机显示不一样 且不是正圆。解决方法使用切图
# 7、css3实现按钮的开关效果 在Android低版本不兼容  解决：静态样式改变
# 8、掉起数字键盘  input type=tel
#    number 类型当输入非数字时，默认保存的值为‘’，
#    pattern=[0-9*]/g 只能在ios掉起数字键盘
# 9、物理返回键  当点击物理返回键时 客户端通知H5， H5去触发左上角自定义的返回按钮的事件
# 10、使用jsbridge  在初始化完jsbridge的回调函数中 去初始化vue实例
# 11、keyup键入时计算输入的字数 在ios不兼容  使用input事件
# 12、safari new Date() 中不转换 2017-06-19格式 可以识别 2017/06/19
=======================================================================================================================
# 考勤
# 1、高德地图定位升级站点到HTTPS
    描述：（1）对于需要使用定位接口的开发者，请升级站点到HTTPS（iOS10、Chrome新版浏览器等环境已禁用非安全页面的浏览器定位）
        （2）HTTPS站点在引用JavaScript API的时候需要修改引用地址的协议为https：
# 2、vue全局配置对象Vue.http.options.emulateJSON = true;
    描述：vue-resource中post请求，这里的post的data默认不是以form data的形式，而是request payload，解决方式是添加全局配置Vue.http.options.emulateJSON = true
# 3、使用eventBus负责组件之间的数据传递
    描述：使用bus传值，在跳转路由后负责接收数据的组件会接收到多次消息（解决：在路由组件的beforeDestroy钩子函数中取消消息的监听）
# 4、对js文件使用babel-loader转码,该插件是用来解析es6等代码
    描述：在webpack.base.conf.js文件中module下面的rules下配置指明哪些目录下的js文件要使用该loader
# 5、关于Vue背景图打包之后访问路径错误问题
    描述：出错点在webpack.base.conf.js文件的url-loader上面，
    解决：（1）使用小图片作为背景图片： 将小于10KB的图片作为背景图片，如果有大于10KB的图片作为img图片。
         （2）修改url-loader的limit值
=======================================================================================================================
# 公告
# 1、移动端双击事件
    描述：在移动端原生没有类似(dblclick)事件。第一次方案为用时间戳模拟双击，即判断两次双击事件的时间戳差值。后来发现在ios能回偶尔失效。故最后引用三方库（hammer.js）
# 2、下拉刷新
    描述：在给一个ul加下拉刷新效果，初期是直接加在此ul上，后来因为ul的高度小于屏幕高度。所以点击空白处不会触发。改善利用导航钩子函数beforeRouteEnter、beforeRouteLeave进行处理。这里需要注意的一点就是beforeRouteEnter中的this无效。
# 3、滚动行为scrollBehavior
    描述：scrollBehavior在移动端有的设备，savedPosition的Y轴滚动距离适中为0。解决就是自己把滚动距离存起来存起来。注意存的时候的scrollTop要处理兼容性。
# 4、css样式
    描述：-webkit-box-orient:vertical,在css样式中不生效，解决方案改加到行间样式style内。
# 5、IOS下事件穿透
    描述：在fix下有router-link。在滑动滚动条过程中会触发事件穿透，进而会触发路由跳转。未解决，但尝试了几种解决方案，其一是fastclick.js；其二是point-events；其三是进行遮罩处理。
# 6、路由跳转
    描述：点击router-link进行路由跳转过程中，或是未进行跳转时，再用window.history.go(-1) 或 this.$router.go(-1)会出现问题。
# 7、 $emit和$on
    描述：进行父子传递事件时没有问题，但是兄弟之间进行传值就会有多次触发$on。
# 8、路由跳转前和后
    描述：beforeRouteEnter 和 beforeRouteLeave进行相关操作。
# 9、keep-alive使用
    描述：需要对数据进行缓存。
=======================================================================================================================
其他：
# 1、安卓手机调试
    描述：数据线连接，开启usb调试。在chrome中输入  chrome://inspect/#devices。找到设备并打开（第一次需要翻墙）。IOS调试暂时没啥好的方案在window下
# 2、对一个数组进行遍历时，并在循环内进行其他复制操作。
    描述：数组A包含N个小Json，在循环过程中，再去判断（if）每项小Json里的键。然后进行相关操作。解决：将数组length赋值给一个变量，循环的时候讲每个小Json也赋值一个变量。
=======================================================================================================================