(function( global, factory ) {
    //For CommonJS and CommonJS-like
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "previewImage requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window){
    var $ = {};
    var style = "#__previewImage-container{-ms-touch-action:none;touch-action:none;-webkit-touch-action:none;line-height:100vh;background-color:#000;width:100;height:100%;position:fixed;overflow:hidden;top:0;left:0;z-index: 23456;transition:transform .3s;-ms-transition:transform .3s;-moz-transition:transform .3s;-webkit-transition:transform .3s;-o-transition:transform .3s;transform:translate3d(100%,0,0);-webkit-transform:translate3d(100%,0,0);-ms-transform:translate3d(100%,0,0);-o-transform:translate3d(100%,0,0);-moz-transform:translate3d(100%,0,0)}#__previewImage-container .previewImage-text{height:1em;width:100%;position:absolute;top:.4em;text-align:center;font-size:3vh;line-height:3vh;color:#fff;z-index:10}#__previewImage-container .previewImage-box{width:999999rem;height:100%}#__previewImage-container .previewImage-box .previewImage-item-noload{background:none !important}#__previewImage-container .previewImage-box .previewImage-item{width:100vw;height:100vh;position:relative;margin-right:15px;float:left;text-align:center;background:url(data:image/gif;base64,R0lGODlhKAAoAJEDAM7O0Y2NjaysrgAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMDYtMDZUMTU6NTM6NDArMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTA2LTA2VDA4OjMxOjMyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE3LTA2LTA2VDA4OjMxOjMyKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL2dpZiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMzFFODlGOTQyQjYxMUU3ODg1OUVGOTlFOTUwNjExOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMzFFODlGQTQyQjYxMUU3ODg1OUVGOTlFOTUwNjExOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUzMUU4OUY3NDJCNjExRTc4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) no-repeat center/16px 16px}#__previewImage-container .previewImage-box .previewImage-item.previewImage-nobackground{background:none}#__previewImage-container .previewImage-box .previewImage-item .previewImage-image{vertical-align:middle;max-width:100%} #__previewImage-container .previewImage-close{background-size:cover;width:0.28rem;height:0.28rem;position:fixed;left:19.3px;top:46.6px;background-image:url('data:image/png;base64,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');@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {background-image: url('data:image/png;base64,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');}background-size: cover;}#__previewImage-container .previewImage-originImage{ position: absolute;left: 50%;bottom: 30px;border:1px solid #fff;border-radius: 5px;width: 140px;height:20px;color: #fff;margin-left: -70px;outline: none;font-family: PingFangSC-Regular;font-size:12px;line-height:20px;text-align:center;}";
    $.isArray = function(value) {
      return Object.prototype.toString.call(value) == '[object Array]';
    }
    /**
     * get multiple elements
     * @public
     */
    $.all = function(selector, contextElement) {
      var nodeList,
        list = [];
      if (contextElement) {
        nodeList = contextElement.querySelectorAll(selector);
      } else {
        nodeList = document.querySelectorAll(selector);
      }
      if (nodeList && nodeList.length > 0) {
        list = Array.prototype.slice.call(nodeList);
      }
      return list;
    }

    /**
     * delegate an event to a parent element
     * @public
     * @param  array     $el        parent element
     * @param  string    eventType  name of the event
     * @param  string    selector   target's selector
     * @param  function  fn
     */
    $.delegate = function($el, eventType, selector, fn) {
      if (!$el) { return; }
      $el.addEventListener(eventType, function(e) {
        var targets = $.all(selector, $el);
        if (!targets) {
          return;
        }
        for (var i=0; i<targets.length; i++) {
          var $node = e.target;
          while ($node) {
            if ($node == targets[i]) {
              fn.call($node, e);
              break;
            }
            $node = $node.parentNode;
            if ($node == $el) {
              break;
            }
          }
        }
      }, false);
    };
    var _previewImage = function(){
        this.winw = window.innerWidth||document.body.clientWidth;  //窗口的宽度
        this.winh = window.innerHeight||document.body.clientHeight; //窗口的高度
        this.marginRight = 15;  //图片之间的间隔->previewImage-item的margin-right
        this.imageChageMoveX = this.marginRight+this.winw;  //图片切换容器的x位移量
        this.imageChageNeedX = Math.floor(this.winw*(0.5)); //图片切换所需x位移量
        this.cssprefix = ["","Webkit","Moz","ms","o"]; //css前缀
        this.version = '1.0.2'; //版本号
        this.imgLoadCache = new Object();  //图片加载状态储存 key=md5(img.src),value={isload:true,elem:img};
        this.scale = 1;     //默认图片放大倍数
        this.maxScale = 4;  //图片默认最大放大倍数
        this.maxOverScale = 6;  //图片放大倍数最大可达到
        // this.minScale = 0.5; //图片最小可放大倍数
        this.openTime = 0.3;    //打开图片浏览动画时间
        this.slipTime = 0.5;    //图片切换时间
        this.$box = false;  //图片容器加载状态
        this.vueObj = null; //传递过来的vue对象实例
        this.timer = null; //定时器
        var $style = document.createElement('style');   //样式标签
        $style.innerText = style;   //加载样式
        $style.type = 'text/css';
        this.$container = document.createElement('div');    //加载容器
        this.$container.id = '__previewImage-container';    //容器加上id
        this.$container.style.width = this.winw+'px';   //加上宽度
        //this.$container.style.height = this.winh+'px';  //加上高度
        document.body.appendChild(this.$container);     //插入容器到body
        document.head.appendChild($style);              //插入样式到head
        this.bind();    //绑定事件
    }
    
    _previewImage.prototype.start = function(obj, vue){  //可优化 todo
        this.hasOrigin=obj.hasOrigin; //是否有查看原图按钮
        this.vueObj = vue
        var urls = obj.urls;    //待预览的图片列表
        var currentIndex = obj.currentIndex;  //当前预览的图片序号
        this.currentImgSize=0;//当前预览的图片的大小
        this.$container.innerHTML = ''; //清空容器
        if(!urls||!$.isArray(urls)||urls.length==0){    //参数检测
            throw new Error("urls must be a Array and the minimum length more than zero");
            return
        }
        if(currentIndex<0){
            this.index=0;
            console.warn("currentIndex is less than 0,it will be the first value of urls!");
        }else if(currentIndex>=urls.length){
            this.index=0;
            console.warn("currentIndex is greater than or equal to 0,it will be the first value of urls!");
        }else{
            this.index=currentIndex;//当前图片序号
            this.currentImgSize=urls[currentIndex].fileSize;
        }
        // if(!currentIndex){   //参数检测
        //     this.index = 0; 
        //     console.warn("current is empty,it will be the first value of urls!");
        // }else{
        //     var index = urls.indexOf(current);
        //     if(index<0){
        //         index = 0;
        //         console.warn("current isnot on urls,it will be the first value of urls!");
        //     }
        //     this.index = index; 
        // }
        this.urls = urls;   //所有图片url列表
        this.maxLen = urls.length-1;  //最大图片数 0<=index<=maxLen
        this.cIndex = this.maxLen+1;    //containerIndex
        this.bIndex = this.maxLen+2;    //boxIndex
        this.maxOverWidthPercent = 0.5; //边界图片最大可拉取宽度，屏幕宽度的百分比
        this.imgStatusCache = new Object(); //图片信息储存
        this.render();                //渲染预览模块

    }

    _previewImage.prototype.render = function(){
        var _this = this;
        if(this.$box===false){  //加载图片容器
            var box = document.createElement('div');
            box.className += 'previewImage-box';
            this.$box = box; //更新图片容器
        }else{
            this.$box.innerHTML = '';  //已有图片容器-清空容器
        }
        var text = document.createElement('div');   //当前张数/总张数--文本标签
        this.$originImageBtn=document.createElement('div');//查看原图的按钮
        this.$closeBtn=document.createElement('div');//关闭按钮
        this.$text = text;
        this.$text.className += 'previewImage-text';
        this.$text.innerText = (this.index+1)+"/"+(this.maxLen+1);    //当前第几张/图片总数
        this.container = this.imgStatusCache[this.cIndex] = {elem:this.$container,x:this.winw,y:0,m:0,my:0,scale:1,scalem:1}; //存储容器状态
        this.box = this.imgStatusCache[this.bIndex] = {elem:this.$box,x:0,y:0,m:0,my:0,scale:1,scalem:1};   //存储图片容器状态
        this.urls.forEach(function(v,i){    //图片
            if(v.url == v.originUrl){
                v.isOrigin=true;
            } 
            var div = document.createElement('div');
            var hash = window.md5?md5(v.url+i):v.url+i;
            var img;
            var imgCache = _this.imgLoadCache[hash];
            //缓存图片&&读取缓存图片
            //console.log(imgCache)
            if(imgCache&&imgCache.isload){    //图片已加载--使用缓存
                img = imgCache.elem;
                if(img.src == v.originUrl){
                    v.isOrigin=true;
                }
                div.className+=' previewImage-item-noload';
                //div.className+=" previewImage-nobackground";
            }else{  //图片未加载--加载图片，加入缓存
                img = new Image();
                img.className += 'previewImage-image ';
                _this.imgLoadCache[hash] = {isload:false,elem:img};
                if(i == _this.index){   //将当前需要预览的图片加载  loading
                    img.src = v.url;
                    img.onload = function(){
                        //div.className+=" previewImage-nobackground";
                        _this.imgLoadCache[hash].isload = true;
                        div.className+=' previewImage-item-noload';
                    }
                    img.onerror = function() {
                        const imgLength = this.parentNode.parentNode.children.length;
                        console.log(this.isload)
                        const imgObj = this.parentNode.parentNode.children;
                        if(imgLength){
                            for(let i=0;i<imgLength;i++){
                                //imgObj[i].classList.add('previewImage-nobackground')
                            }
                        }
                    }
                }
            }
            _this.imgStatusCache[i] = {hash:hash,x:0,m:0,y:0,my:0,scale:_this.scale,scalem:1};  //修改缓存状态
            // img.setAttribute("data-index",i);  //未使用
            div.className+=' previewImage-item';
            div.appendChild(img);
            _this.$box.appendChild(div); //将图片div加入 图片容器
        })
        
        this.$container.appendChild(this.$box);    //加载图片容器
        this.$container.appendChild(this.$text);    //加载图片张数提示
        //生成关闭按钮
        this.$closeBtn.className="previewImage-close";
        this.$closeBtn.onclick=function(e){
            _this.closePreview.call(_this);
        }
        this.$container.appendChild(this.$closeBtn);
        //如果有显示原图按钮，则显示原图
        if(this.hasOrigin){
            this.$originImageBtn.className="previewImage-originImage";
            this.$originImageBtn.innerHTML="查看原图("+this.currentImgSize+")";
            this.$originImageBtn.onclick=function(e){
                var hash = _this.imgStatusCache[_this.index].hash;
                var imgCache = _this.imgLoadCache[hash];
                _this.$originImageBtn.innerHTML="正在加载...";
                //重新请求高清图
                imgCache.elem.src = _this.urls[_this.index].originUrl;
                imgCache.elem.onload = function(){
                    //imgCache.elem.parentNode.className+=" previewImage-nobackground";
                    imgCache.isload = true;
                    _this.$originImageBtn.style.visibility="hidden";
                    _this.urls[_this.index].url=_this.urls[_this.index].originUrl;
                    _this.urls[_this.index].isOrigin=true;
                }
                
            }
            this.$container.appendChild(this.$originImageBtn);
        }
        if(this.hasOrigin && !this.urls[this.index].isOrigin){
            this.$originImageBtn.style.visibility="visible";
        }else if(this.hasOrigin && this.urls[this.index].isOrigin){
            this.$originImageBtn.style.visibility="hidden";
        }
        this.$text.style.display = "none";
        var offsetX = -this.imageChageMoveX*this.index;  //计算显示当前图片，容器所需偏移量
        this.box.x = offsetX;   //将图片容器所需偏移量，存入状态缓存器
        this.container.x = 0;   //显示预览模块
        setTimeout(function(){
            _this.translateScale(_this.bIndex,0);
            _this.translateScale(_this.cIndex,_this.openTime);
        },50);
    }

    _previewImage.prototype.bind = function(){
        var $container = this.$container;
        var _this = this;
        var closePreview = function(){
            _this.closePreview.call(_this);
        }
        var touchStartFun = function(){
            _this.touchStartFun.call(_this);
        }
        var touchMoveFun = function(){
            _this.touchMoveFun.call(_this);
        }
        var touchEndFun = function(){
            _this.touchEndFun.call(_this);
        }

        $.delegate($container,'click','.previewImage-item',closePreview);
        $.delegate($container,'touchstart','.previewImage-item',touchStartFun);
        $.delegate($container,'touchmove','.previewImage-item',touchMoveFun);
        $.delegate($container,'touchend','.previewImage-item',touchEndFun);
        $.delegate($container,'touchcancel','.previewImage-item',touchEndFun);
    }

    _previewImage.prototype.closePreview = function(){
        this.imgStatusCache[this.cIndex].x = this.winw;
        this.translateScale(this.cIndex,this.openTime);
        this.imgStatusRewrite();
        this.translateScale(this.index,this.slipTime);
    }

    _previewImage.prototype.touchStartFun = function(imgitem,e){
        clearTimeout(this.timer)
        var _this = this;
         //longtap长按事件,保存到相册回调
        this.timer = setTimeout(function() {
            //本期注调图片保存功能
           _this.vueObj.saveImgToast(_this.urls[_this.index].url)
          }, 800)
        this.ts = this.getTouches();
        this.allowMove = true;  //行为标记
        this.statusX = 0; //标记X轴位移状态
        this.statusY = 0; //标记Y轴位移状态
    }

    _previewImage.prototype.touchMoveFun = function(imgitem){
        clearTimeout(this.timer)
        this.tm = this.getTouches();
        var tm = this.tm;
        var ts = this.ts;
        this.moveAction(ts,tm);
    }

    _previewImage.prototype.touchEndFun = function(imgitem){
        clearTimeout(this.timer)
        var $container = this.$container;
        this.te = this.getTouches();
        this.endAction(this.ts,this.te);
    }

    _previewImage.prototype.moveAction = function(ts,tm){
        if(!this.allowMove){
            return
        }
        var imgStatus = this.getIndexImage();
        var maxWidth = this.winw*0.3/imgStatus.scale;
        var x0_offset = tm.x0 - ts.x0;
        var y0_offset = tm.y0 - ts.y0;
        if(Math.abs(y0_offset)>0){  //阻止Ios系统的浏览器环境上下滑动
            event.preventDefault();
        }
        var imgPositionX = imgStatus.x+x0_offset;
        var imgPositionY = imgStatus.y+y0_offset;
        var allow = this.getAllow(this.index);
        var allowX = this.allowX = allow.x;
        var allowY = this.allowY = allow.y0;
        if(x0_offset<=0){  //边界
            this.allowX = -allowX;
        }
        if(y0_offset<=0){   //边界
            allowY = this.allowY = allow.y1;
        }
        if(tm.length==1){   //单手指(图片位移)
            if(imgStatus.scale>1){ 
                //Y方向位移
                if(imgPositionY>=allow.y0){  //超过窗口上边界
                    this.statusY = 1;
                    var overY = imgPositionY - allow.y0;
                    imgStatus.my = allow.y0-imgStatus.y+this.getSlowlyNum(overY,maxWidth);
                }else if(imgPositionY<=allow.y1){ //超过窗口下边界
                    this.statusY = 1;
                    var overY = imgPositionY - allow.y1;
                    imgStatus.my = allow.y1-imgStatus.y+this.getSlowlyNum(overY,maxWidth); 
                }else{
                    this.statusY = 2;
                    imgStatus.my = y0_offset;
                }
                
                //X方向位移
                if(x0_offset<0&&imgStatus.x<=-allowX){ //左滑->初始状态到达或超过右边界->图片平滑移动到达条件-切换下一张
                    this.statusX = 1;
                    this.box.m = x0_offset; //更新位移信息
                    if(this.index==this.maxLen){ //box到达右边界
                        this.box.m = this.getSlowlyNum(x0_offset);  //阻尼效果
                    }
                    this.translateScale(this.bIndex,0);
                    this.translateScale(this.index,0);
                }else if(x0_offset>0&&imgStatus.x>=allowX){    //右滑->初始状态到达或超过左边界->图片平滑移动到达条件-切换上一张
                    this.statusX = 2;
                    this.box.m = x0_offset;
                    if(this.index==0){ //box到达左边界
                        this.box.m = this.getSlowlyNum(x0_offset);  //阻尼效果
                    }
                    this.translateScale(this.bIndex,0);
                    this.translateScale(this.index,0);
                }else{  //初始状态未到边界->图片平滑移动到边界->阻尼移动
                    if(x0_offset==0){
                        return
                    }
                    this.statusX = 3;
                    imgStatus.m = x0_offset;
                    if(imgPositionX>=allowX){   //右滑到达左边界
                        this.statusX = 4;
                        var overX = imgPositionX - allowX;
                        imgStatus.m = allowX-imgStatus.x+this.getSlowlyNum(overX,maxWidth);
                    }
                    if(imgPositionX<=-allowX){  //左滑到达右边界
                        this.statusX = 4;
                        var overX = imgPositionX + allowX;
                        imgStatus.m = -allowX-imgStatus.x+this.getSlowlyNum(overX,maxWidth);
                    }
                    this.translateScale(this.index,0);
                }
            }else{  //scale == 1;
                if(Math.abs(y0_offset)>5&&this.statusX != 5){  //长图片处理
                    var $img = this.getJqElem(this.index);
                    var imgBottom = $img.height-this.winh;
                    if(y0_offset>0&&imgPositionY>0){
                        this.statusX = 7;
                        this.allowY = 0;
                        imgStatus.my = - imgStatus.y + this.getSlowlyNum(imgPositionY,maxWidth);
                    }else if(y0_offset<0&&imgPositionY<-imgBottom){
                        this.statusX = 7;
                        if($img.height>this.winh){
                            var overY = imgPositionY + imgBottom;
                            this.allowY = -imgBottom;
                            imgStatus.my = -imgBottom - imgStatus.y + this.getSlowlyNum(overY,maxWidth);
                        }else{
                            this.allowY = 0;
                            imgStatus.my = - imgStatus.y + this.getSlowlyNum(imgPositionY,maxWidth);
                        }
                    }else{

                        this.statusX = 6;
                        imgStatus.my = y0_offset;
                    }
                    this.translateScale(this.index,0);
                }else{
                    if(this.statusX == 6){
                        return
                    }
                    this.statusX = 5;
                    if((this.index==0&&x0_offset>0)||(this.index==this.maxLen&&x0_offset<0)){ //box到达左右边界
                        this.box.m = this.getSlowlyNum(x0_offset);
                    }else{
                        this.box.m = x0_offset;
                    }
                    this.translateScale(this.bIndex,0);
                }
            }
        }else{  //多手指(图片放大缩小)
            var scalem = this.getScale(ts,tm)
            var scale = scalem*imgStatus.scale;
            if(scale>=this.maxScale){  //达到最大放大倍数
                var over = scale - this.maxScale;
                scale = this.maxScale+this.getSlowlyNum(over,this.maxOverScale);
                scalem = scale/imgStatus.scale;
            }
            imgStatus.scalem = scalem;
            this.translateScale(this.index,0);
        }
    }

    _previewImage.prototype.endAction = function(ts,te){
        var imgStatus = this.getIndexImage();
        var x0_offset = te.x0 - ts.x0;
        var y0_offset = te.y0 - ts.y0;
        var time = te.time - ts.time;
        var slipTime = 0;
        this.allowMove = false; //结束所有行为
        if(ts.length==1){      //单手指(图片位移)
            if(Math.abs(x0_offset)>10){ //防止误触关闭看图
                event.preventDefault();
            }
            switch(this.statusY){
                case 1:
                    imgStatus.y = this.allowY;
                    imgStatus.my = 0;
                    slipTime = this.slipTime;
                break
                case 2:
                    imgStatus.y = imgStatus.y+imgStatus.my;
                    imgStatus.my = 0;
                break
            }

            switch(this.statusX){
                case 1: //左滑->初始状态到达或超过右边界->图片平滑移动到达条件-切换下一图
                    if(this.index!=this.maxLen&&(x0_offset<=-this.imageChageNeedX||(time<200&&x0_offset<-30))){    //下一图
                        this.changeIndex(1);
                    }else{
                        this.changeIndex(0);
                        if(slipTime!=0){
                            this.translateScale(this.index,slipTime);
                        }
                    }
                break
                case 2: //右滑->初始状态到达或超过左边界->图片平滑移动到达条件-切换上一图
                    if(this.index!=0&&(x0_offset>=this.imageChageNeedX||(time<200&&x0_offset>30))){ //上一图
                        this.changeIndex(-1);
                    }else{
                        this.changeIndex(0);
                        if(slipTime!=0){
                            this.translateScale(this.index,slipTime);
                        }
                    }
                break
                case 3: //scale>1,初始状态未到边界->图片平滑移动未到边界
                    imgStatus.x = imgStatus.x+imgStatus.m;
                    imgStatus.m = 0;
                    this.translateScale(this.index,slipTime);
                break
                case 4: //scale>1,初始状态未到边界->图片平滑移动到边界->阻尼移动
                    imgStatus.x = this.allowX;
                    imgStatus.m = 0;
                    slipTime = this.slipTime;
                    this.translateScale(this.index,slipTime);
                break
                case 5: //scale=1,box位移，图片切换
                    if(x0_offset>=this.imageChageNeedX||(time<200&&x0_offset>30)){    //上一图
                        this.changeIndex(-1);
                    }else if(x0_offset<=-this.imageChageNeedX||(time<200&&x0_offset<-30)){ //下一图
                        this.changeIndex(1);
                    }else{
                        this.changeIndex(0);
                    }
                break
                case 6: //scale=1,长图片
                    imgStatus.y = imgStatus.y+imgStatus.my;
                    imgStatus.my = 0;
                break
                case 7: //scale=1,长图片 到边界
                    imgStatus.y = this.allowY;
                    imgStatus.my = 0;
                    this.translateScale(this.index,this.slipTime);
                break
            }
        }else{  // 放大倍数问题
            event.preventDefault();
            var scale = imgStatus.scale*imgStatus.scalem;
            var $img = this.getJqElem(this.index);
            imgStatus.scale = scale;
            var allow = this.getAllow(this.index);

            if(imgStatus.x>allow.x){
                slipTime = this.slipTime; 
                imgStatus.x = allow.x;
            }else if(imgStatus.x<-allow.x){
                slipTime = this.slipTime;
                imgStatus.x = -allow.x;
            }

            if(imgStatus.y>allow.y0){
                slipTime = this.slipTime; 
                imgStatus.y = allow.y0;
            }else if(imgStatus.y<allow.y1){
                slipTime = this.slipTime; 
                imgStatus.y = allow.y1;
            }

            if($img.height*imgStatus.scale<=this.winh){
                imgStatus.y = 0;
            }

            if($img.width*imgStatus.scale<=this.winw){
                imgStatus.x = 0;
            }

            imgStatus.scalem = 1;
            if(scale>this.maxScale){     //倍数大于最大限制倍数
                imgStatus.scale = this.maxScale;
                slipTime = this.slipTime;
            }else if(scale<1){//倍数小于1
                this.imgStatusRewrite();
                slipTime = this.slipTime;
            }
            if(slipTime!=0){
                this.changeIndex(0);
                this.translateScale(this.index,slipTime);
            }
        }
    };

    _previewImage.prototype.getAllow = function(index){
        var $img = this.getJqElem(index);
        var imgStatus = this.getIndexImage(index);
        var allowX = Math.floor(($img.width*imgStatus.scale-this.winw)/(2*imgStatus.scale));
        var allowY0,allowY1;
        if($img.height*imgStatus.scale<=this.winh){
            allowY0 = 0;
            allowY1 = 0;
        }else if($img.height<=this.winh){
            allowY0 = Math.floor(($img.height*imgStatus.scale-this.winh)/(2*imgStatus.scale));
            allowY1 = -allowY0;
        }else{
            allowY0 = Math.floor($img.height*(imgStatus.scale-1)/(2*imgStatus.scale));
            allowY1 = -Math.floor(($img.height*(imgStatus.scale+1)-2*this.winh)/(2*imgStatus.scale));
        }
        return {
            x:allowX,
            y0:allowY0,
            y1:allowY1,
        };
    };

    _previewImage.prototype.getSlowlyNum = function(x,maxOver){
        var maxOver = maxOver||this.winw*this.maxOverWidthPercent;
        if(x<0){
            x = -x;
            return -(1-(x/(maxOver+x)))*x;
        }else{
            return (1-(x/(maxOver+x)))*x;
        }
    };

    _previewImage.prototype.getScale = function(ts,tm){
        var fingerRangeS = Math.sqrt(Math.pow((ts.x1 - ts.x0),2)+Math.pow((ts.y1-ts.y0),2)); //两手指的初始距离
        var fingerRangeM = Math.sqrt(Math.pow((tm.x1 - tm.x0),2)+Math.pow((tm.y1-tm.y0),2)); //两手指移动过程中的距离
        var range = fingerRangeM/fingerRangeS;
        return range;
    };

    _previewImage.prototype.imgStatusRewrite = function(index){
        var index = index===undefined?this.index:index;
        var imgStatus = this.imgStatusCache[index];
        imgStatus.x = 0;
        imgStatus.y = 0;
        imgStatus.m = 0;
        imgStatus.my = 0;
        imgStatus.scale = 1;
        imgStatus.scalem = 1;
        if(index!=this.index){
            this.translateScale(index,this.slipTime);
        }
    }

    _previewImage.prototype.changeIndex = function(x){
        var imgStatus = this.getIndexImage();
        var oldIndex = this.index;
        var _this = this;
        if(this.index==0&&x==-1){
            this.index = this.index;
        }else if(this.index==this.maxLen&&x==1){
            this.index = this.index;
        }else{
            this.index+=x;
            this.currentImgSize=this.urls[this.index].fileSize;
            this.$originImageBtn.innerHTML="查看原图("+this.currentImgSize+")";
            //如果已经是高清图，需要隐藏查看原图的按钮
            if(this.hasOrigin && this.urls[this.index].isOrigin){
                this.$originImageBtn.style.visibility="hidden";
            }else if(this.hasOrigin && !this.urls[this.index].isOrigin){
                this.$originImageBtn.style.visibility="visible";
            }
            this.$text.innerText = (this.index+1)+"/"+(this.maxLen+1);
            var hash = this.imgStatusCache[this.index].hash;
            var imgCache = this.imgLoadCache[hash];
            if(!imgCache.isload){    //图片未缓存则加载图片   loading效果
                imgCache.elem.src = this.urls[this.index].url;
                imgCache.elem.onload = function(){
                    //imgCache.elem.parentNode.className+=" previewImage-nobackground";
                    imgCache.isload = true;
                }
            }else{
                //imgCache.elem.parentNode.className+=" previewImage-nobackground";
            }
        }
        this.box.x = -this.imageChageMoveX*this.index;
        this.box.m = 0;
        if(oldIndex!=this.index){
            this.imgStatusRewrite(oldIndex);
        }
        this.translateScale(this.bIndex,this.slipTime);
    }

    _previewImage.prototype.getIndexImage = function(index){
        var index = index==undefined?this.index:index;
        return  this.imgStatusCache[this.index];
    }

    _previewImage.prototype.translateScale = function (index,duration){

        this.vueObj.saveImg = false;
        var imgStatus = this.imgStatusCache[index];
        var $elem = this.getJqElem(index);
        var scale = imgStatus.scale*imgStatus.scalem;
        var offsetX = imgStatus.x+imgStatus.m;
        var offsetY = imgStatus.y+imgStatus.my;
        //处理header 无聊返回键
        if(offsetX == this.winw){
            this.vueObj.isCarousel = false;
        }
        var tran_3d='scale3d('+scale+','+scale+',1) '+' translate3d(' + offsetX + 'px,' + offsetY + 'px,0px)';
        // var tran_2d='scale('+scale+','+scale+') '+' translate(' + offsetX + 'px,' + offsetY +'px)';
        var transition = 'transform '+duration+'s ease-out';
        this.addCssPrefix($elem,'transition',transition);
        this.addCssPrefix($elem,'transform',tran_3d);
    }

    _previewImage.prototype.getJqElem = function(index){
        var $elem;
        var index = index==undefined?this.index:index;
        if(index<=this.maxLen){
            var hash = this.imgStatusCache[index].hash;
            var img = this.imgLoadCache[hash].elem;
            $elem = img;
        }else{
            var elem = this.imgStatusCache[index].elem;
            $elem = elem;
        }

        return $elem
    }
    /**
     * [addCssPrefix 增加css前缀]
     * @param {[elem]} elem  [element]
     * @param {[string]} prop  [css attribute]
     * @param {[string]} value [css value]
     */
    _previewImage.prototype.addCssPrefix = function(elem,prop,value){    //可以优化todo
        elem.style[prop] = value;
        // if('transform' in elem.style){
        //     alert(1);
        //     elem.style[prop] = value;   
        // }else{
        //     alert('不支持')
        //     prop = 'webkit' + prop.charAt(0).toUpperCase() + prop.substr(1);
        //     alert('不支持:'+prop+ ':' + value)
        //     elem.style[prop] = value;
        // }
        // if(document.body.style[prop]!==undefined){
        //     elem.style[prop] = value;
        //     return 
        // }else{
        //     prop = '-Webkit-' + prop;
        //     elem.style[prop] = value;
        //     return 
        // }
        // elem.style[aaa] = value;
        // for(var i in this.cssprefix){
        //     const cssprefix = this.cssprefix[i];
        //     if(cssprefix===""){
        //         prop = prop.toLowerCase();
        //     }else{
        //         var len = prop.length;
        //         prop = prop.substr(0,1).toUpperCase()+prop.substr(1,len).toLowerCase()
        //     }
        //     if(document.body.style[prop]!==undefined){
        //         // alert(prop)
        //         elem.style[prop] = value;
        //         return 
        //     }
        // }
    }

    _previewImage.prototype.getTouches = function(e){
        var touches = event.touches.length>0?event.touches:event.changedTouches;
        var obj = {touches:touches,length:touches.length};
            obj.x0 = touches[0].pageX
            obj.y0 = touches[0].pageY;
            obj.time = new Date().getTime();
        if(touches.length>=2){
            obj.x1 = touches[0].pageX
            obj.y1 = touches[1].pageY
        }
        return obj;
    }
    window.previewImage = new _previewImage();
    // AMD loader
    if ( typeof define === "function" && define.amd ) {
        define([], function() {
            return previewImage;
        } );
    }

    return previewImage;
}));