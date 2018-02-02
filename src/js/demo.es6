let o = [];
o.push(...Sizzle('.img'));
o.push(...Sizzle('.imgBg'));

let lazy = new Lazyload({
    obj:o,          //懒加载元素
    range:100       //容差范围
});

//自定义提示
lazy.tips = (o)=>{
    let obj = o.o,
        schedule = o.schedule;

    if(obj.lazy_isEchoTip === undefined){
        obj.lazy_isEchoTip = true;
        obj.lazy_otip = document.createElement('canvas');
        obj.lazy_otip.className = 'imgLoadTip';

        obj.lazy_otipText = document.createElement('span');
        obj.lazy_otipText.className = 'imgLoadTipText';

        obj.lazy_otipCtx = obj.lazy_otip.getContext('2d');
        obj.lazy_otip.width = 60;
        obj.lazy_otip.height = 60;
        
        obj.parentNode.insertBefore(obj.lazy_otip,obj.nextSibling); 
        obj.parentNode.insertBefore(obj.lazy_otipText,obj.nextSibling);
    };

    let c = obj.lazy_otip,
        ctx = obj.lazy_otipCtx,
        w = c.width,
        h = c.height,
        r = c.width / 2,
        deg = Math.PI/180;

    //绘制背景
    ctx.clearRect(0,0,w,h);

    ctx.beginPath();
    ctx.arc(r, r, r, 0*deg, 360*deg);
    ctx.fillStyle = 'rgba(57,57,57,0.8)';
    ctx.closePath();
    ctx.fill();

    //绘制内圈
    ctx.beginPath();
    ctx.arc(r, r, r - 10, 0*deg, 360*deg);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.closePath();
    ctx.fill();
    
    //绘制进度
    let v = schedule * 360;
    
    ctx.beginPath();
    ctx.moveTo(r,r);
    ctx.arc(r, r, r - 10, -90*deg, (-90 + v) *deg);
    
    ctx.fillStyle = 'rgba(176,227,110,1)';
    ctx.closePath();
    ctx.fill();

    //进度文字
    let text = parseInt(schedule * 100) + '%';
    obj.lazy_otipText.innerHTML = text;
    
    //删除绘图和提示文字
    if(schedule === 1 && obj.lazy_isEchoTip){
        obj.parentNode.removeChild(obj.lazy_otip);
        obj.parentNode.removeChild(obj.lazy_otipText); 
    };
};

lazy.init();