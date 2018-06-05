/*(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/


(function(doc,win){
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function(){
        var clientWidth = docEl.clientWidth;
        if(!clientWidth) return;
        var fsize=parseFloat(100*(clientWidth/375)).toFixed(2);
        docEl.style.fontSize = fsize+'px';
        var realF=parseFloat(window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize).toFixed(2);
        if (realF!=fsize) {
            docEl.style.fontSize=parseInt((fsize*fsize/realF))+'px';
        }
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
})(document,window); 
/*此版本为了解决rem受系统设置了字体的影响而失效的问题*/