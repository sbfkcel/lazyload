(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) : 
	typeof define === 'function' && (define.cmd || define.hjs) ? define(function(require,exports,module){module.exports = factory()}) :
	(global.Lazyload = factory());
}(this, (function () { 'use strict';

var $Blob = (function (array, option) {
    if (window.Blob) {
        return new Blob(array, option);
    }
    else {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        if (window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(array);
            return bb.getBlob(typeof option === 'object' ? option.type : undefined);
        }
        return bb;
    }
});

var $addEvent = (function (e, type, fn, mark) {
    if (e.addEventListener) {
        e.addEventListener(type, fn, false);
    }
    else if (e.attachEvent) {
        //e.detachEvent('on'+type,fn);
        e.attachEvent('on' + type, function () {
            fn.call(e, window.event);
        });
    }
});

var $URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
var Lazyload = /** @class */ (function () {
    function Lazyload(obj) {
        var _ts = this;
        var config = _ts.config = {}, data = _ts.data = {}, o = _ts.obj = {
            doc: document.documentElement,
            body: document.body
        }, blankImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
        for (var i in obj) {
            _ts.config[i] = obj[i];
        }
        //默认容差在100像
        _ts.config['range'] = typeof _ts.config['range'] === 'numver' ? _ts.config['range'] : 100;
        //图片方法扩展
        _ts.imageExtend();
        //图片数据处理
        for (var i = 0, len = config.obj.length; i < len; i++) {
            var item = config.obj[i], dataSrc = item.lazy_dataSrc = item.getAttribute('data-src'), dataCover = item.lazy_dataCover = item.getAttribute('data-cover');
            if (item.src === '') {
                item.src = blankImg;
            }
            item.removeAttribute('data-src');
            //将获取的对象存储起来
            if (data[dataSrc] === undefined) {
                data[dataSrc] = [];
            }
            data[dataSrc].push(item);
        }
    }
    Lazyload.prototype.init = function () {
        var _ts = this, config = _ts.config, data = _ts.data, o = _ts.obj, task, temp;
        //图片更新执行
        (task = function () {
            //得到当前屏幕区域的需要更新图片列表
            var eList = _ts.getShowList();
            //遍历加载图片
            for (var i = 0, len = eList.length; i < len; i++) {
                var item = eList[i], key = item.lazy_dataSrc;
                _ts.loadImg(item);
            }
        })();
        var run = function () {
            clearTimeout(temp);
            temp = setTimeout(task, 200);
        };
        $addEvent(window, 'scroll', run);
        $addEvent(window, 'resize', run);
    };
    /**
     * 图片方法扩展
     *
     * @memberof Lazyload
     */
    Lazyload.prototype.imageExtend = function () {
        var _ts = this;
        Image.prototype.load = function (url, oL) {
            var updateImg = function (src) {
                //更新图片
                for (var i = 0, len = oL.length; i < len; i++) {
                    var item = oL[i];
                    _ts.updateImg(item, src);
                }
            }, updateTips = function (o) {
                //更新提示
                for (var i = 0, len = oL.length; i < len; i++) {
                    var item = oL[i];
                    item.completedPercentage = o;
                    o.o = item;
                    _ts.tips(o);
                }
            };
            if ($Blob && $URL && XMLHttpRequest) {
                var xhr_1 = new XMLHttpRequest();
                xhr_1.open('GET', url, true);
                xhr_1.responseType = 'arraybuffer';
                xhr_1.onload = function (e) {
                    var headers = xhr_1.getAllResponseHeaders(), m = headers.match(/^Content-Type\:\s*(.*?)$/mi), mimeType = m[1] || 'image/png', blob = $Blob([this.response], {
                        type: mimeType
                    }), src = $URL.createObjectURL(blob);
                    updateImg(src);
                };
                xhr_1.onloadstart = xhr_1.onprogress = xhr_1.onloadend = function (e) {
                    var o = {
                        loaded: e.loaded,
                        total: e.total,
                        status: e.type,
                        schedule: e.loaded === 0 ? 0 : e.loaded / e.total
                    };
                    updateTips(o);
                };
                xhr_1.send();
            }
            else {
                var o_1 = {
                    loaded: undefined,
                    total: undefined,
                    status: 'loaded',
                    schedule: 0
                }, temp_1;
                temp_1 = setInterval(function () {
                    if (o_1.schedule > 0.98) {
                        clearInterval(temp_1);
                    }
                    o_1.schedule = o_1.schedule + 0.01;
                    o_1.status = 'progress';
                    updateTips(o_1);
                }, 100);
                this.onload = function () {
                    clearInterval(temp_1);
                    updateImg(this.src);
                    o_1.status = 'loaded';
                    o_1.schedule = 1;
                    updateTips(o_1);
                };
            }
        };
    };
    /**
     * 获取浏览器窗口大小
     *
     * @returns {object} 容器宽高
     * @memberof Lazyload
     */
    Lazyload.prototype.getWinSize = function () {
        var _ts = this, o = _ts.obj;
        var o = {
            w: window.innerWidth || o.doc.clientWidth,
            h: window.innerHeight || o.doc.clientHeight
        };
        return o;
    };
    /**
     * 获取页面滚动的像素
     */
    Lazyload.prototype.getWinScroll = function () {
        var _ts = this, o = _ts.obj;
        var d = {
            // x: window.scrollX || document.compatMode == "BackCompat" ? document.body.scrollLeft : document.documentElement.scrollLeft,
            // y: window.scrollY || document.compatMode == "BackCompat" ? document.body.scrollTop : document.documentElement.scrollTop
            x: window.scrollX || document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft,
            y: window.scrollY || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        };
        return d;
    };
    Lazyload.prototype.loadImg = function (o) {
        var _ts = this, data = _ts.data;
        //已经加载过的则不处理
        if (o.lazy_isInit) {
            return;
        }
        var list = data[o.lazy_dataSrc];
        // if(o.tagName === 'IMG'){
        //     o.load(o.lazy_dataSrc,list);
        // }else{
        var img = new Image();
        img.load(o.lazy_dataSrc, list);
        img.src = o.lazy_dataSrc;
        // if($Blob){
        // img.load(o.lazy_dataSrc, list);
        // }else{
        //     //模拟加载
        //     img.onload = function(){
        //         for(let i=0,len=list.length; i<len; i++){
        //             let item = list[i];
        //             _ts.updateImg(item,src);
        //         };
        //     };
        // };
        // };
        //更新图片地址相同的元素
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            if (item.lazy_isInit) {
                continue;
            }
            item.lazy_isInit = true;
            if (item.lazy_dataCover) {
                _ts.updateImg(item, item.lazy_dataCover);
            }
        }
    };
    /**
     * 更新图片
     *
     * @param {object} o 需要更新的元素
     * @param {string} url 图片地址
     * @memberof Lazyload
     */
    Lazyload.prototype.updateImg = function (o, url) {
        if (o.tagName === 'IMG') {
            o.src = url;
        }
        else {
            o.style.backgroundImage = "url(" + url + ")";
        }
    };
    Lazyload.prototype.getElementTop = function (element) {
        var actualTop = element.offsetTop, current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };
    Lazyload.prototype.getElementLeft = function (element) {
        var actualLeft = element.offsetLeft, current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    };
    /**
     * 获取需要显示的元素
     */
    Lazyload.prototype.getShowList = function () {
        var _ts = this, config = _ts.config, data = _ts.data;
        var scroll = _ts.getWinScroll(), winSize = _ts.getWinSize(), temp = [];
        //console.log(scroll,winSize)
        for (var i = 0, len = config.obj.length; i < len; i++) {
            var item = config.obj[i], left = _ts.getElementLeft(item), top = _ts.getElementTop(item), width = item.clientWidth, height = item.clientHeight, xl = left + width - scroll.x > 0 - config.range, //页面左侧显示条件
            xr = winSize.w + scroll.x + config.range > left, //页面右侧显示条件
            yt = top + height - scroll.y > 0 - config.range, //页面顶部显示条件
            yb = top < scroll.y + winSize.h + config.range, //页面底部显示条件
            isInit = item.lazy_isInit;
            //console.log(item,isInit,'left',left,'top',top,'width',width,'height',height);
            if (xl && xr && yt && yb && !isInit) {
                temp.push(item);
            }
        }
        return temp;
    };
    /**
     * 默认的提示方法
     * @param obj --
     */
    Lazyload.prototype.tips = function (obj) {
        var schedule = parseInt(obj.schedule * 100) + '%', o = obj.o;
        if (o.lazy_isEchoTip === undefined) {
            o.lazy_isEchoTip = true;
            o.lazy_oTip = document.createElement('span');
            o.lazy_oTip.className = 'lazy_tip';
            o.parentNode.insertBefore(o.lazy_oTip, o.nextSibling);
            //console.log(o.lazy_otip.parentNode)
        }
        o.lazy_oTip.innerHTML = schedule;
        //当加载进度为1时，则移除对应的加载提示
        if (obj.schedule === 1 && o.lazy_isEchoTip) {
            o.parentNode.removeChild(o.lazy_oTip);
            o.lazy_isEchoTip = undefined;
        }
    };
    return Lazyload;
}());

return Lazyload;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF6eWxvYWQuZXM2Iiwic291cmNlcyI6WyJfQmxvYi5lczYiLCJfYWRkRXZlbnQuZXM2IiwiTGF6eWxvYWQuZXM2Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChhcnJheSxvcHRpb24pPT57XG4gICAgaWYod2luZG93LkJsb2Ipe1xuICAgICAgICByZXR1cm4gbmV3IEJsb2IoYXJyYXksb3B0aW9uKVxuICAgIH1lbHNle1xuICAgICAgICB3aW5kb3cuQmxvYkJ1aWxkZXIgPSB3aW5kb3cuQmxvYkJ1aWxkZXIgfHwgd2luZG93LldlYktpdEJsb2JCdWlsZGVyIHx8IHdpbmRvdy5Nb3pCbG9iQnVpbGRlciB8fCB3aW5kb3cuTVNCbG9iQnVpbGRlcjtcbiAgICAgICAgaWYod2luZG93LkJsb2JCdWlsZGVyKXtcbiAgICAgICAgICAgIGxldCBiYiA9IG5ldyBCbG9iQnVpbGRlcigpO1xuICAgICAgICAgICAgYmIuYXBwZW5kKGFycmF5KTtcbiAgICAgICAgICAgIHJldHVybiBiYi5nZXRCbG9iKHR5cGVvZiBvcHRpb24gPT09ICdvYmplY3QnID8gb3B0aW9uLnR5cGUgOiB1bmRlZmluZWQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYmI7XG4gICAgfTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgKGUsdHlwZSxmbixtYXJrKT0+e1xuICAgIGlmKGUuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLGZuLGZhbHNlKTtcbiAgICB9ZWxzZSBpZihlLmF0dGFjaEV2ZW50KXtcbiAgICAgICAgLy9lLmRldGFjaEV2ZW50KCdvbicrdHlwZSxmbik7XG4gICAgICAgIGUuYXR0YWNoRXZlbnQoJ29uJyt0eXBlLCgpPT57XG4gICAgICAgICAgICBmbi5jYWxsKGUsd2luZG93LmV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn07IiwiaW1wb3J0ICRCbG9iIGZyb20gJy4vX0Jsb2IuZXM2JztcbmltcG9ydCAkYWRkRXZlbnQgZnJvbSAnLi9fYWRkRXZlbnQuZXM2JztcblxuY29uc3QgJFVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTCB8fCB3aW5kb3cubW96VVJMIHx8IHdpbmRvdy5tc1VSTDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF6eWxvYWQge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBjb25zdCBfdHMgPSB0aGlzO1xuICAgICAgICBsZXQgY29uZmlnID0gX3RzLmNvbmZpZyA9IHt9LFxuICAgICAgICAgICAgZGF0YSA9IF90cy5kYXRhID0ge30sXG4gICAgICAgICAgICBvID0gX3RzLm9iaiA9IHtcbiAgICAgICAgICAgICAgICBkb2M6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICBib2R5OiBkb2N1bWVudC5ib2R5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhbmtJbWcgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSc7XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiBvYmopIHtcbiAgICAgICAgICAgIF90cy5jb25maWdbaV0gPSBvYmpbaV07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy/pu5jorqTlrrnlt67lnKgxMDDlg49cbiAgICAgICAgX3RzLmNvbmZpZ1sncmFuZ2UnXSA9IHR5cGVvZiBfdHMuY29uZmlnWydyYW5nZSddID09PSAnbnVtdmVyJyA/IF90cy5jb25maWdbJ3JhbmdlJ10gOiAxMDA7XG5cbiAgICAgICAgLy/lm77niYfmlrnms5XmianlsZVcbiAgICAgICAgX3RzLmltYWdlRXh0ZW5kKCk7XG5cbiAgICAgICAgLy/lm77niYfmlbDmja7lpITnkIZcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNvbmZpZy5vYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY29uZmlnLm9ialtpXSxcbiAgICAgICAgICAgICAgICBkYXRhU3JjID0gaXRlbS5sYXp5X2RhdGFTcmMgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSxcbiAgICAgICAgICAgICAgICBkYXRhQ292ZXIgPSBpdGVtLmxhenlfZGF0YUNvdmVyID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY292ZXInKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0uc3JjID09PSAnJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uc3JjID0gYmxhbmtJbWc7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaXRlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XG5cbiAgICAgICAgICAgIC8v5bCG6I635Y+W55qE5a+56LGh5a2Y5YKo6LW35p2lXG4gICAgICAgICAgICBpZiAoZGF0YVtkYXRhU3JjXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtkYXRhU3JjXSA9IFtdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRhdGFbZGF0YVNyY10ucHVzaChpdGVtKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBjb25zdCBfdHMgPSB0aGlzLFxuICAgICAgICAgICAgY29uZmlnID0gX3RzLmNvbmZpZyxcbiAgICAgICAgICAgIGRhdGEgPSBfdHMuZGF0YSxcbiAgICAgICAgICAgIG8gPSBfdHMub2JqLFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgIHRlbXA7XG5cbiAgICAgICAgLy/lm77niYfmm7TmlrDmiafooYxcbiAgICAgICAgKHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAvL+W+l+WIsOW9k+WJjeWxj+W5leWMuuWfn+eahOmcgOimgeabtOaWsOWbvueJh+WIl+ihqFxuICAgICAgICAgICAgbGV0IGVMaXN0ID0gX3RzLmdldFNob3dMaXN0KCk7XG5cbiAgICAgICAgICAgIC8v6YGN5Y6G5Yqg6L295Zu+54mHXG4gICAgICAgICAgICBmb3IobGV0IGk9MCxsZW49ZUxpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGVMaXN0W2ldLFxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBpdGVtLmxhenlfZGF0YVNyYztcbiAgICAgICAgICAgICAgICBfdHMubG9hZEltZyhpdGVtKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgbGV0IHJ1biA9ICgpPT57XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGVtcCk7XG4gICAgICAgICAgICB0ZW1wID0gc2V0VGltZW91dCh0YXNrLCAyMDApO1xuICAgICAgICB9O1xuXG4gICAgICAgICRhZGRFdmVudCh3aW5kb3csJ3Njcm9sbCcscnVuKTtcbiAgICAgICAgJGFkZEV2ZW50KHdpbmRvdywncmVzaXplJyxydW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWbvueJh+aWueazleaJqeWxlVxuICAgICAqIFxuICAgICAqIEBtZW1iZXJvZiBMYXp5bG9hZFxuICAgICAqL1xuICAgIGltYWdlRXh0ZW5kKCkge1xuICAgICAgICBjb25zdCBfdHMgPSB0aGlzO1xuXG4gICAgICAgIEltYWdlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKHVybCwgb0wpIHtcbiAgICAgICAgICAgIGxldCB1cGRhdGVJbWcgPSAoc3JjKSA9PiB7XG4gICAgICAgICAgICAgICAgLy/mm7TmlrDlm77niYdcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb0wubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBvTFtpXTtcbiAgICAgICAgICAgICAgICAgICAgX3RzLnVwZGF0ZUltZyhpdGVtLCBzcmMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlVGlwcyA9IChvKSA9PiB7XG4gICAgICAgICAgICAgICAgLy/mm7TmlrDmj5DnpLpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb0wubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBvTFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21wbGV0ZWRQZXJjZW50YWdlID0gbztcbiAgICAgICAgICAgICAgICAgICAgby5vID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgX3RzLnRpcHMobyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICgkQmxvYiAmJiAkVVJMICYmIFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoZWFkZXJzID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGhlYWRlcnMubWF0Y2goL15Db250ZW50LVR5cGVcXDpcXHMqKC4qPykkL21pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlID0gbVsxXSB8fCAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2IgPSAkQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtaW1lVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSAkVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW1nKHNyYyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHhoci5vbmxvYWRzdGFydCA9IHhoci5vbnByb2dyZXNzID0geGhyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkOiBlLmxvYWRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBlLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBlLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZTogZS5sb2FkZWQgPT09IDAgPyAwIDogZS5sb2FkZWQgLyBlLnRvdGFsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpcHMobyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2xvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZTogMFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgdGVtcCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8uc2NoZWR1bGUgPiAwLjk4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRlbXApO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBvLnNjaGVkdWxlID0gby5zY2hlZHVsZSArIDAuMDE7XG4gICAgICAgICAgICAgICAgICAgIG8uc3RhdHVzID0gJ3Byb2dyZXNzJztcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGlwcyhvKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRlbXApO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbWcodGhpcy5zcmMpO1xuICAgICAgICAgICAgICAgICAgICBvLnN0YXR1cyA9ICdsb2FkZWQnO1xuICAgICAgICAgICAgICAgICAgICBvLnNjaGVkdWxlID0gMTtcblxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaXBzKG8pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPlua1j+iniOWZqOeql+WPo+Wkp+Wwj1xuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOWuueWZqOWuvemrmFxuICAgICAqIEBtZW1iZXJvZiBMYXp5bG9hZFxuICAgICAqL1xuICAgIGdldFdpblNpemUoKSB7XG4gICAgICAgIGNvbnN0IF90cyA9IHRoaXMsXG4gICAgICAgICAgICBvID0gX3RzLm9iajtcbiAgICAgICAgbGV0IG8gPSB7XG4gICAgICAgICAgICB3OiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBvLmRvYy5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGg6IHdpbmRvdy5pbm5lckhlaWdodCB8fCBvLmRvYy5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W6aG16Z2i5rua5Yqo55qE5YOP57SgXG4gICAgICovXG4gICAgZ2V0V2luU2Nyb2xsKCkge1xuICAgICAgICBjb25zdCBfdHMgPSB0aGlzLFxuICAgICAgICAgICAgbyA9IF90cy5vYmo7XG4gICAgICAgIGxldCBkID0ge1xuICAgICAgICAgICAgLy8geDogd2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuY29tcGF0TW9kZSA9PSBcIkJhY2tDb21wYXRcIiA/IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgICAgICAgLy8geTogd2luZG93LnNjcm9sbFkgfHwgZG9jdW1lbnQuY29tcGF0TW9kZSA9PSBcIkJhY2tDb21wYXRcIiA/IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICAgICAgeDogd2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICAgIHk6IHdpbmRvdy5zY3JvbGxZIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuXG4gICAgbG9hZEltZyhvKSB7XG4gICAgICAgIGNvbnN0IF90cyA9IHRoaXMsXG4gICAgICAgICAgICBkYXRhID0gX3RzLmRhdGE7XG5cbiAgICAgICAgLy/lt7Lnu4/liqDovb3ov4fnmoTliJnkuI3lpITnkIZcbiAgICAgICAgaWYgKG8ubGF6eV9pc0luaXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIGxldCBsaXN0ID0gZGF0YVtvLmxhenlfZGF0YVNyY107XG5cbiAgICAgICAgLy8gaWYoby50YWdOYW1lID09PSAnSU1HJyl7XG4gICAgICAgIC8vICAgICBvLmxvYWQoby5sYXp5X2RhdGFTcmMsbGlzdCk7XG4gICAgICAgIC8vIH1lbHNle1xuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltZy5sb2FkKG8ubGF6eV9kYXRhU3JjLCBsaXN0KTtcbiAgICAgICAgaW1nLnNyYyA9IG8ubGF6eV9kYXRhU3JjO1xuXG4gICAgICAgIC8vIGlmKCRCbG9iKXtcbiAgICAgICAgLy8gaW1nLmxvYWQoby5sYXp5X2RhdGFTcmMsIGxpc3QpO1xuICAgICAgICAvLyB9ZWxzZXtcbiAgICAgICAgLy8gICAgIC8v5qih5ouf5Yqg6L29XG4gICAgICAgIC8vICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgICAgICBmb3IobGV0IGk9MCxsZW49bGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspe1xuICAgICAgICAvLyAgICAgICAgICAgICBsZXQgaXRlbSA9IGxpc3RbaV07XG4gICAgICAgIC8vICAgICAgICAgICAgIF90cy51cGRhdGVJbWcoaXRlbSxzcmMpO1xuICAgICAgICAvLyAgICAgICAgIH07XG4gICAgICAgIC8vICAgICB9O1xuICAgICAgICAvLyB9O1xuXG4gICAgICAgIC8vIH07XG5cblxuICAgICAgICAvL+abtOaWsOWbvueJh+WcsOWdgOebuOWQjOeahOWFg+e0oFxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0ubGF6eV9pc0luaXQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpdGVtLmxhenlfaXNJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKGl0ZW0ubGF6eV9kYXRhQ292ZXIpe1xuICAgICAgICAgICAgICAgIF90cy51cGRhdGVJbWcoaXRlbSwgaXRlbS5sYXp5X2RhdGFDb3Zlcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOabtOaWsOWbvueJh1xuICAgICAqIFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvIOmcgOimgeabtOaWsOeahOWFg+e0oFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg5Zu+54mH5Zyw5Z2AXG4gICAgICogQG1lbWJlcm9mIExhenlsb2FkXG4gICAgICovXG4gICAgdXBkYXRlSW1nKG8sIHVybCkge1xuICAgICAgICBpZiAoby50YWdOYW1lID09PSAnSU1HJykge1xuICAgICAgICAgICAgby5zcmMgPSB1cmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHt1cmx9KWA7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFRvcChlbGVtZW50KSB7XG4gICAgICAgIGxldCBhY3R1YWxUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgIGN1cnJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcblxuICAgICAgICB3aGlsZSAoY3VycmVudCAhPT0gbnVsbCkge+OAgOOAgOOAgOOAgOOAgOOAgFxuICAgICAgICAgICAgYWN0dWFsVG9wICs9IGN1cnJlbnQub2Zmc2V0VG9wO+OAgOOAgOOAgOOAgOOAgOOAgFxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQub2Zmc2V0UGFyZW50O+OAgOOAgOOAgOOAgFxuICAgICAgICB9O+OAgOOAgOOAgFxuICAgICAgICByZXR1cm4gYWN0dWFsVG9wO1xuICAgIH1cblxuICAgIGdldEVsZW1lbnRMZWZ0KGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGFjdHVhbExlZnQgPSBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICBjdXJyZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG7jgIDjgIDjgIBcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IG51bGwpIHvjgIDjgIDjgIDjgIDjgIDjgIBcbiAgICAgICAgICAgIGFjdHVhbExlZnQgKz0gY3VycmVudC5vZmZzZXRMZWZ0O+OAgOOAgOOAgOOAgOOAgOOAgFxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQub2Zmc2V0UGFyZW50O+OAgOOAgOOAgOOAgFxuICAgICAgICB9O1xuICAgICAgICDjgIDjgIDjgIDjgIBcbiAgICAgICAgcmV0dXJuIGFjdHVhbExlZnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W6ZyA6KaB5pi+56S655qE5YWD57SgXG4gICAgICovXG4gICAgZ2V0U2hvd0xpc3QoKSB7XG4gICAgICAgIGNvbnN0IF90cyA9IHRoaXMsXG4gICAgICAgICAgICBjb25maWcgPSBfdHMuY29uZmlnLFxuICAgICAgICAgICAgZGF0YSA9IF90cy5kYXRhO1xuXG4gICAgICAgIGxldCBzY3JvbGwgPSBfdHMuZ2V0V2luU2Nyb2xsKCksXG4gICAgICAgICAgICB3aW5TaXplID0gX3RzLmdldFdpblNpemUoKSxcbiAgICAgICAgICAgIHRlbXAgPSBbXTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzY3JvbGwsd2luU2l6ZSlcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY29uZmlnLm9iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjb25maWcub2JqW2ldLFxuICAgICAgICAgICAgICAgIGxlZnQgPSBfdHMuZ2V0RWxlbWVudExlZnQoaXRlbSksXG4gICAgICAgICAgICAgICAgdG9wID0gX3RzLmdldEVsZW1lbnRUb3AoaXRlbSksXG4gICAgICAgICAgICAgICAgd2lkdGggPSBpdGVtLmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGl0ZW0uY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHhsID0gbGVmdCArIHdpZHRoIC0gc2Nyb2xsLnggPiAwIC0gY29uZmlnLnJhbmdlLCAvL+mhtemdouW3puS+p+aYvuekuuadoeS7tlxuICAgICAgICAgICAgICAgIHhyID0gd2luU2l6ZS53ICsgc2Nyb2xsLnggKyBjb25maWcucmFuZ2UgPiBsZWZ0LCAvL+mhtemdouWPs+S+p+aYvuekuuadoeS7tlxuICAgICAgICAgICAgICAgIHl0ID0gdG9wICsgaGVpZ2h0IC0gc2Nyb2xsLnkgPiAwIC0gY29uZmlnLnJhbmdlLCAvL+mhtemdoumhtumDqOaYvuekuuadoeS7tlxuICAgICAgICAgICAgICAgIHliID0gdG9wIDwgc2Nyb2xsLnkgKyB3aW5TaXplLmggKyBjb25maWcucmFuZ2UsIC8v6aG16Z2i5bqV6YOo5pi+56S65p2h5Lu2XG4gICAgICAgICAgICAgICAgaXNJbml0ID0gaXRlbS5sYXp5X2lzSW5pdDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXRlbSxpc0luaXQsJ2xlZnQnLGxlZnQsJ3RvcCcsdG9wLCd3aWR0aCcsd2lkdGgsJ2hlaWdodCcsaGVpZ2h0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHhsICYmIHhyICYmIHl0ICYmIHliICYmICFpc0luaXQpIHtcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpu5jorqTnmoTmj5DnpLrmlrnms5VcbiAgICAgKiBAcGFyYW0gb2JqIC0tXG4gICAgICovXG4gICAgdGlwcyhvYmopIHtcbiAgICAgICAgbGV0IHNjaGVkdWxlID0gcGFyc2VJbnQob2JqLnNjaGVkdWxlICogMTAwKSArICclJyxcbiAgICAgICAgICAgIG8gPSBvYmoubztcblxuICAgICAgICBpZiAoby5sYXp5X2lzRWNob1RpcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvLmxhenlfaXNFY2hvVGlwID0gdHJ1ZTtcbiAgICAgICAgICAgIG8ubGF6eV9vVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgby5sYXp5X29UaXAuY2xhc3NOYW1lID0gJ2xhenlfdGlwJztcbiAgICAgICAgICAgIG8ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoby5sYXp5X29UaXAsIG8ubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvLmxhenlfb3RpcC5wYXJlbnROb2RlKVxuICAgICAgICB9O1xuXG4gICAgICAgIG8ubGF6eV9vVGlwLmlubmVySFRNTCA9IHNjaGVkdWxlO1xuXG4gICAgICAgIC8v5b2T5Yqg6L296L+b5bqm5Li6MeaXtu+8jOWImeenu+mZpOWvueW6lOeahOWKoOi9veaPkOekulxuICAgICAgICBpZihvYmouc2NoZWR1bGUgPT09IDEgJiYgby5sYXp5X2lzRWNob1RpcCl7XG4gICAgICAgICAgICBvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoby5sYXp5X29UaXApO1xuICAgICAgICAgICAgby5sYXp5X2lzRWNob1RpcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfTtcbiAgICB9XG59OyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxhQUFlLFVBQUMsS0FBSyxFQUFDLE1BQU07SUFDeEIsSUFBRyxNQUFNLENBQUMsSUFBSSxFQUFDO1FBQ1gsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUMsTUFBTSxDQUFDLENBQUE7S0FDaEM7U0FBSTtRQUNELE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsaUJBQWlCLElBQUksTUFBTSxDQUFDLGNBQWMsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3JILElBQUcsTUFB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