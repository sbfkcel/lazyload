import $Blob from './_Blob.es6';
import $addEvent from './_addEvent.es6';

const $URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

export default class Lazyload {
    constructor(obj) {
        const _ts = this;
        let config = _ts.config = {},
            data = _ts.data = {},
            o = _ts.obj = {
                doc: document.documentElement,
                body: document.body
            },
            blankImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';

        for (let i in obj) {
            _ts.config[i] = obj[i];
        };

        //默认容差在100像
        _ts.config['range'] = typeof _ts.config['range'] === 'numver' ? _ts.config['range'] : 100;

        //图片方法扩展
        _ts.imageExtend();

        //图片数据处理
        for (let i = 0, len = config.obj.length; i < len; i++) {
            let item = config.obj[i],
                dataSrc = item.lazy_dataSrc = item.getAttribute('data-src'),
                dataCover = item.lazy_dataCover = item.getAttribute('data-cover');

            if (item.src === '') {
                item.src = blankImg;
            };
            item.removeAttribute('data-src');

            //将获取的对象存储起来
            if (data[dataSrc] === undefined) {
                data[dataSrc] = [];
            };
            data[dataSrc].push(item);
        };
    }

    init() {
        const _ts = this,
            config = _ts.config,
            data = _ts.data,
            o = _ts.obj,
            task,
            temp;

        //图片更新执行
        (task = () => {
            //得到当前屏幕区域的需要更新图片列表
            let eList = _ts.getShowList();

            //遍历加载图片
            for(let i=0,len=eList.length; i<len; i++){
                let item = eList[i],
                    key = item.lazy_dataSrc;
                _ts.loadImg(item);
            };
        })();

        let run = ()=>{
            clearTimeout(temp);
            temp = setTimeout(task, 200);
        };

        $addEvent(window,'scroll',run);
        $addEvent(window,'resize',run);
    }

    /**
     * 图片方法扩展
     * 
     * @memberof Lazyload
     */
    imageExtend() {
        const _ts = this;

        Image.prototype.load = function (url, oL) {
            let updateImg = (src) => {
                //更新图片
                for (let i = 0, len = oL.length; i < len; i++) {
                    let item = oL[i];
                    _ts.updateImg(item, src);
                };
            },
            updateTips = (o) => {
                //更新提示
                for (let i = 0, len = oL.length; i < len; i++) {
                    let item = oL[i];
                    item.completedPercentage = o;
                    o.o = item;
                    _ts.tips(o);
                };
            };

            if ($Blob && $URL && XMLHttpRequest) {
                let img = this,
                    xhr = new XMLHttpRequest();

                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    let headers = xhr.getAllResponseHeaders(),
                        m = headers.match(/^Content-Type\:\s*(.*?)$/mi),
                        mimeType = m[1] || 'image/png',
                        blob = $Blob([this.response], {
                            type: mimeType
                        }),
                        src = $URL.createObjectURL(blob);
                    updateImg(src);
                };

                xhr.onloadstart = xhr.onprogress = xhr.onloadend = function (e) {
                    let o = {
                        loaded: e.loaded,
                        total: e.total,
                        status: e.type,
                        schedule: e.loaded === 0 ? 0 : e.loaded / e.total
                    };
                    updateTips(o);
                };
                xhr.send();
            } else {
                let o = {
                        loaded: undefined,
                        total: undefined,
                        status: 'loaded',
                        schedule: 0
                    },
                    temp;

                temp = setInterval(() => {
                    if (o.schedule > 0.98) {
                        clearInterval(temp);
                    };
                    o.schedule = o.schedule + 0.01;
                    o.status = 'progress';
                    updateTips(o);
                }, 100);
                
                this.onload = function () {
                    clearInterval(temp);
                    updateImg(this.src);
                    o.status = 'loaded';
                    o.schedule = 1;

                    updateTips(o);
                };
            };
        };
    }

    /**
     * 获取浏览器窗口大小
     * 
     * @returns {object} 容器宽高
     * @memberof Lazyload
     */
    getWinSize() {
        const _ts = this,
            o = _ts.obj;
        let o = {
            w: window.innerWidth || o.doc.clientWidth,
            h: window.innerHeight || o.doc.clientHeight
        };
        return o;
    }

    /**
     * 获取页面滚动的像素
     */
    getWinScroll() {
        const _ts = this,
            o = _ts.obj;
        let d = {
            // x: window.scrollX || document.compatMode == "BackCompat" ? document.body.scrollLeft : document.documentElement.scrollLeft,
            // y: window.scrollY || document.compatMode == "BackCompat" ? document.body.scrollTop : document.documentElement.scrollTop
            x: document.compatMode == "BackCompat" ? document.body.scrollLeft : document.documentElement.scrollLeft,
            y: document.compatMode == "BackCompat" ? document.body.scrollTop : document.documentElement.scrollTop
        };

        return d;
    }

    loadImg(o) {
        const _ts = this,
            data = _ts.data;

        //已经加载过的则不处理
        if (o.lazy_isInit) {
            return;
        };


        let list = data[o.lazy_dataSrc];

        // if(o.tagName === 'IMG'){
        //     o.load(o.lazy_dataSrc,list);
        // }else{
        let img = new Image();
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
        for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i];
            if (item.lazy_isInit) {
                continue;
            };
            item.lazy_isInit = true;
            if(item.lazy_dataCover){
                _ts.updateImg(item, item.lazy_dataCover);
            };
        };
    }

    /**
     * 更新图片
     * 
     * @param {object} o 需要更新的元素
     * @param {string} url 图片地址
     * @memberof Lazyload
     */
    updateImg(o, url) {
        if (o.tagName === 'IMG') {
            o.src = url;
        } else {
            o.style.backgroundImage = `url(${url})`;
        };
    }

    getElementTop(element) {
        let actualTop = element.offsetTop,
            current = element.offsetParent;

        while (current !== null) {　　　　　　
            actualTop += current.offsetTop;　　　　　　
            current = current.offsetParent;　　　　
        };　　　
        return actualTop;
    }

    getElementLeft(element) {
        let actualLeft = element.offsetLeft,
            current = element.offsetParent;
　　　
        while (current !== null) {　　　　　　
            actualLeft += current.offsetLeft;　　　　　　
            current = current.offsetParent;　　　　
        };
        　　　　
        return actualLeft;
    }

    /**
     * 获取需要显示的元素
     */
    getShowList() {
        const _ts = this,
            config = _ts.config,
            data = _ts.data;

        let scroll = _ts.getWinScroll(),
            winSize = _ts.getWinSize(),
            temp = [];
        //console.log(scroll,winSize)

        for (let i = 0, len = config.obj.length; i < len; i++) {
            let item = config.obj[i],
                left = _ts.getElementLeft(item),
                top = _ts.getElementTop(item),
                width = item.clientWidth,
                height = item.clientHeight,
                xl = left + width - scroll.x > 0 - config.range, //页面左侧显示条件
                xr = winSize.w + scroll.x + config.range > left, //页面右侧显示条件
                yt = top + height - scroll.y > 0 - config.range, //页面顶部显示条件
                yb = top < scroll.y + winSize.h + config.range, //页面底部显示条件
                isInit = item.lazy_isInit;
            //console.log('left',left,'top',top,'width',width,'height',height);

            if (xl && xr && yt && yb && !isInit) {
                temp.push(item);
            };
        };
        return temp;
    }

    /**
     * 默认的提示方法
     * @param obj --
     */
    tips(obj) {
        let schedule = parseInt(obj.schedule * 100) + '%',
            o = obj.o;

        if (o.lazy_isEchoTip === undefined) {
            o.lazy_isEchoTip = true;
            o.lazy_oTip = document.createElement('span');
            o.lazy_oTip.className = 'lazy_tip';
            o.parentNode.insertBefore(o.lazy_oTip, o.nextSibling);
            //console.log(o.lazy_otip.parentNode)
        };

        o.lazy_oTip.innerHTML = schedule;

        //当加载进度为1时，则移除对应的加载提示
        if(obj.schedule === 1 && o.lazy_isEchoTip){
            o.parentNode.removeChild(o.lazy_oTip);
            o.lazy_isEchoTip = undefined;
        };
    }
};